from twilio.twiml.voice_response import VoiceResponse, Record
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from users.models import Operador
from incidents.models import Incident
from google import genai
import os
import json
from decimal import Decimal

PREDEFINED_MESSAGE = """
Hi, this message will be recorded! Please describe your situation!
Backup will be on its way soon!
"""

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

@csrf_exempt
def receive_call(request):
    resp = VoiceResponse()

    resp.say(
        PREDEFINED_MESSAGE,
        voice="alice",
        language="en-US"
    )

    
    resp.record(
        action="/calls/recording/",
        method="POST",
        max_length=300,
        transcribe=True,
        play_beep=True
    )

    return HttpResponse(str(resp), content_type="text/xml")



@csrf_exempt
def recording(request):
    """
    Recebe a transcrição do Twilio, envia para a IA e cria uma ocorrência.
    Sempre gera uma ocorrência, mesmo sem TranscriptionText.
    """
    transcription_text = request.POST.get("TranscriptionText", "")
    call_sid = request.POST.get("CallSid", "")

    print(f"Transcription for call {call_sid}: {transcription_text}")

    if not transcription_text:
        transcription_text = "O utilizador não forneceu informações. Gere uma ocorrência inventando os detalhes de forma plausível."

    
    profissao_valida = [p[0] for p in Operador.Profissao.choices]
    distritos_validos = [d[0] for d in Operador.Distrito.choices]

    
    prompt = f"""
    Você é um assistente que cria ocorrências com base no relato do utilizador.
    Retorne um JSON com os seguintes campos:
    - titulo: resumo curto
    - descricao: descrição detalhada
    - tipo: obrigatoriamente um dos valores válidos {profissao_valida}
    - latitude: decimal
    - longitude: decimal
    - distrito: obrigatoriamente um dos distritos válidos {distritos_validos}

    IMPORTANTE:
    - Sempre retorne um JSON válido.
    - Use apenas tipos e distritos válidos.
    - Se não houver informação do utilizador, invente uma ocorrência plausível.
    
    Texto do utilizador:
    \"\"\"{transcription_text}\"\"\"
    """

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        print("AI Response:", response.text)

        raw_text = response.text.strip()
        if raw_text.startswith("```"):
            raw_text = "\n".join(raw_text.split("\n")[1:-1])

        data = json.loads(raw_text)

        latitude = Decimal(data.get("latitude", 0))
        longitude = Decimal(data.get("longitude", 0))

        incident = Incident.objects.create(
            titulo=data.get("titulo", "Ocorrência sem título"),
            descricao=data.get("descricao", transcription_text),
            tipo=data["tipo"],      
            latitude=latitude,
            longitude=longitude,
            distrito=data["distrito"]  
        )

        print(f"Created Incident: {incident}")

    except json.JSONDecodeError:
        print("Erro: AI não retornou JSON válido.")
    except Exception as e:
        print("Erro ao criar ocorrência:", str(e))


    return HttpResponse("OK", status=200)

