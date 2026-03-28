import json
import re
from google import genai
from google.genai.chats import GenerateContentResponse
from twilio.rest import Client

from core.config import settings

from .messages import SMS_TO_SEND


def get_gemini_client() -> genai.Client:
    if not settings.gemini_api_key:
        raise RuntimeError("GEMINI_API_KEY is not configured.")
    
    return genai.Client(api_key=settings.gemini_api_key)


def generate_ai_response(prompt: str) -> GenerateContentResponse:
    client = get_gemini_client()
    response = client.models.generate_content(
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
    cleaned_text = re.sub(r'[\x00-\x1F\x7F]', '', raw_text)
    return json.loads(cleaned_text)

def send_sms_message(number_to_send: str, details_link: str):
    if not all(
        [
            settings.twilio_account_sid,
            settings.twilio_auth_token,
            settings.twilio_sender_number,
            number_to_send,
        ]
    ):
        return

    client = Client(
        settings.twilio_account_sid,
        settings.twilio_auth_token,
    )

    content = SMS_TO_SEND.format(
        number=number_to_send,
        link=details_link,
    )

    client.messages.create(
        from_=settings.twilio_sender_number,
        to=number_to_send,
        body=content,
    )