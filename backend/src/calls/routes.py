from fastapi import APIRouter
from twilio.twiml.voice_response import VoiceResponse
from .messages import INITIAL_MESSAGE
from fastapi.responses import Response

router = APIRouter()

@router.post("/record")
def record():
    
    response = VoiceResponse()

    response.say(INITIAL_MESSAGE)

    response.record(
        transcribe=True,
        transcribe_callback="/transcription"
    )

    response.hangup()

    return str(response)


@router.post("/transcription")
def handle_transcription(
    TranscriptionText: str,
    Confidence: str,
    From: str,
):
    print(TranscriptionText)

    return Response(content="Transcription completed!", media_type="application/xml")