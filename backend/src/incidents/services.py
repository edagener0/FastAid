import os
import json
from google import genai
from google.genai.chats import GenerateContentResponse
from twilio.rest import Client
from .messages import SMS_TO_SEND

gemini_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def generate_ai_response(prompt: str) -> GenerateContentResponse:
    response = gemini_client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return response

def clean_ai_response(response: GenerateContentResponse) -> str:
    raw_text = response.text.strip()

    if raw_text.startswith("```"):
        raw_text = "\n".join(raw_text.split("\n")[1:-1])
    
    return raw_text

def raw_text_2_json(raw_text: str) -> dict:
    return json.loads(raw_text)

def send_sms_message(number_to_send: str, details_link: str):
    client = Client(
        os.environ.get('TWILIO_ACCOUNT_SID'), 
        os.environ.get('TWILIO_AUTH_TOKEN'))

    content = SMS_TO_SEND.format(
        number=number_to_send,
        link=details_link)

    message = client.messages.create(
        from_=os.environ.get('TWILIO_SENDER_NUMBER'),
        to=number_to_send,
        body=content
    )