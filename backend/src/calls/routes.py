from fastapi import APIRouter, Request
from fastapi.responses import Response
from twilio.twiml.voice_response import VoiceResponse
from .messages import INITIAL_MESSAGE, INCIDENT_EXTRACTION_PROMPT
from incidents.models import Incident
from incidents.services import generate_ai_response, clean_ai_response, raw_text_2_json, send_sms_message
from db.session import SessionDep

router = APIRouter()


@router.post("/record")
def record():
    response = VoiceResponse()

    response.say(INITIAL_MESSAGE)

    response.record(
        transcribe=True,
        transcribe_callback="/calls/transcription",
        method="POST"
    )

    return Response(str(response), media_type="application/xml")

@router.get("/sendSMSTest")
def send_sms_test():
    send_sms_message(
        "+351966036754", #Bruno Brás NUMBER
        "https://google.com/a1ff4261-1f39-43a5-8f6e-03188500242f") #LINK PARA ACOMPANHAMENTO DA OCORRENCIA

@router.post("/transcription")
async def handle_transcription(request: Request, session: SessionDep):
    form = await request.form()
    data = dict(form)

    if data.get("TranscriptionStatus") != "completed":
        return Response("", media_type="application/xml")

    transcription_text = data.get("TranscriptionText", "")
    phone = data.get("From")

    prompt = INCIDENT_EXTRACTION_PROMPT.format(transcription=transcription_text)

    ai_raw_response = generate_ai_response(prompt)
    cleaned = clean_ai_response(ai_raw_response)
    extracted = raw_text_2_json(cleaned)

    title = extracted.get("title", "Incident")
    description = extracted.get("description", transcription_text[:200])
    report = extracted.get("report", transcription_text)
    lat = extracted.get("lat")
    lon = extracted.get("lon")
    place = extracted.get("place")

    incident = Incident(
        title=title,
        description=description,
        lat=lat,
        lon=lon,
        phone=phone,
        transcription=transcription_text,
        report=report,
        place=place
    )

    session.add(incident)
    session.commit()
    session.refresh(incident)

    response = VoiceResponse()
    response.say("Backup will be on its way soon. Thank you for contacting us.")

    #send_sms_message(
    #    phone,
    #   "https://google.com/{incident.id})

    return Response(str(response), media_type="application/xml")