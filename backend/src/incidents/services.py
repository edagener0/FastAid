from google import genai
import os
from google.genai.chats import GenerateContentResponse
import json


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