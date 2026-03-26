from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import Response
from twilio.twiml.voice_response import VoiceResponse

from core.config import settings
from db.session import SessionDep
from incidents.models import Incident
from incidents.services import clean_ai_response, generate_ai_response, raw_text_2_json, send_sms_message

from .messages import INCIDENT_EXTRACTION_PROMPT, INITIAL_MESSAGE

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

@router.post("/transcription")
async def handle_transcription(request: Request, session: SessionDep):
    form = await request.form()
    data = dict(form)

    if data.get("TranscriptionStatus") != "completed":
        return Response("", media_type="application/xml")

    transcription_text = data.get("TranscriptionText", "")
    phone = data.get("From")

    prompt = INCIDENT_EXTRACTION_PROMPT.format(transcription=transcription_text)

    try:
        ai_raw_response = generate_ai_response(prompt)
        cleaned = clean_ai_response(ai_raw_response)
        extracted = raw_text_2_json(cleaned)
    except Exception as error:
        raise HTTPException(status_code=502, detail="Unable to process call transcription.") from error

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

    send_sms_message(
        phone,
        f"{settings.frontend_base_url.rstrip('/')}/{incident.id}",
    )

    return Response(str(response), media_type="application/xml")
