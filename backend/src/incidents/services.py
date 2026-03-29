import json
import re
from collections import Counter
from hashlib import sha1
from threading import Lock
from datetime import timezone, datetime, timedelta
from google import genai
from google.genai.chats import GenerateContentResponse
from twilio.rest import Client

from core.config import settings

from .messages import INCIDENT_STATISTICS_ANALYSIS_PROMPT, SMS_TO_SEND
from .models import Incident, IncidentStatus
from .statistics import AIStatisticsInsights, CountBucket, IncidentStatisticsAIResponse, IncidentStatisticsResponse, IncidentStatisticsSummary, RecentIncidentSample


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


DISTRICT_KEYWORDS: dict[str, tuple[str, ...]] = {
    "Aveiro": ("aveiro",),
    "Beja": ("beja",),
    "Braga": ("braga",),
    "Bragança": ("braganca", "bragança"),
    "Castelo Branco": ("castelo branco",),
    "Coimbra": ("coimbra",),
    "Évora": ("evora", "évora"),
    "Faro": ("faro",),
    "Guarda": ("guarda",),
    "Leiria": ("leiria",),
    "Lisboa": ("lisboa", "lisbon"),
    "Portalegre": ("portalegre",),
    "Porto": ("porto",),
    "Santarém": ("santarem", "santarém"),
    "Setúbal": ("setubal", "setúbal"),
    "Viana do Castelo": ("viana do castelo",),
    "Vila Real": ("vila real",),
    "Viseu": ("viseu",),
}

ROAD_KEYWORDS = (
    "road",
    "highway",
    "motorway",
    "autoestrada",
    "estrada",
    "ic",
    "ip",
    "a1",
    "a2",
    "a3",
    "a4",
    "a5",
    "a6",
    "a8",
    "a9",
    "a10",
    "a11",
    "a12",
    "a13",
    "a14",
    "a15",
    "a16",
    "a17",
    "a22",
    "a23",
    "a24",
    "a25",
    "a28",
    "tunnel",
    "bridge",
    "km",
)

WEEKDAY_LABELS = ("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun")
AI_STATISTICS_CACHE_TTL = timedelta(minutes=10)
_ai_statistics_cache: dict[str, tuple[datetime, AIStatisticsInsights]] = {}
_ai_statistics_cache_lock = Lock()
SUPPORTED_STATISTICS_LANGUAGES = {"pt": "Portuguese", "en": "English"}


def normalize_text(value: str | None) -> str:
    if not value:
        return ""

    normalized = value.casefold()
    replacements = {
        "á": "a",
        "à": "a",
        "ã": "a",
        "â": "a",
        "é": "e",
        "ê": "e",
        "í": "i",
        "ó": "o",
        "ô": "o",
        "õ": "o",
        "ú": "u",
        "ç": "c",
    }

    for source, target in replacements.items():
        normalized = normalized.replace(source, target)

    return normalized


def infer_incident_district(incident: Incident) -> str | None:
    haystack = " ".join(
        [
            incident.title or "",
            incident.description or "",
            incident.place or "",
            incident.report or "",
            incident.transcription or "",
        ]
    )
    normalized = normalize_text(haystack)

    for district, keywords in DISTRICT_KEYWORDS.items():
        if any(keyword in normalized for keyword in keywords):
            return district

    if incident.lat is None or incident.lon is None:
        return None

    lat = incident.lat
    lon = incident.lon

    if lat >= 41.5:
        return "Viana do Castelo" if lon < -8.5 else "Braga"
    if lat >= 41.0:
        if lon < -8.0:
            return "Porto"
        return "Vila Real" if lon > -7.3 else "Braga"
    if lat >= 40.4:
        if lon < -8.1:
            return "Aveiro"
        return "Viseu"
    if lat >= 39.9:
        if lon < -8.3:
            return "Coimbra"
        return "Guarda"
    if lat >= 39.2:
        if lon < -8.7:
            return "Leiria"
        return "Castelo Branco"
    if lat >= 38.6:
        if lon < -9.2:
            return "Lisboa"
        return "Santarém" if lon > -8.5 else "Setúbal"
    if lat >= 37.8:
        return "Évora" if lon > -8.2 else "Setúbal"
    return "Beja" if lon > -8.4 else "Faro"


def is_road_related_incident(incident: Incident) -> bool:
    haystack = normalize_text(
        " ".join(
            [
                incident.title or "",
                incident.description or "",
                incident.place or "",
                incident.report or "",
            ]
        )
    )
    return any(keyword in haystack for keyword in ROAD_KEYWORDS)


def is_urgent_incident(incident: Incident) -> bool:
    if incident.status == IncidentStatus.FECHADO:
        return False

    created_at = incident.created_at
    if created_at.tzinfo is None:
        created_at = created_at.replace(tzinfo=timezone.utc)

    age = datetime.now(timezone.utc) - created_at
    return age <= timedelta(hours=4)


def build_incident_statistics(incidents: list[Incident]) -> IncidentStatisticsResponse:
    now = datetime.now(timezone.utc)
    district_counts: Counter[str] = Counter()
    status_counts: Counter[str] = Counter()
    hour_counts: Counter[int] = Counter()
    weekday_counts: Counter[int] = Counter()
    road_related_incidents = 0
    motorway_signal_incidents = 0
    urgent_incidents = 0
    incidents_last_24h = 0
    incidents_last_7d = 0
    incidents_with_coordinates = 0

    recent_samples: list[RecentIncidentSample] = []

    for incident in incidents:
        created_at = incident.created_at
        if created_at.tzinfo is None:
            created_at = created_at.replace(tzinfo=timezone.utc)

        district = infer_incident_district(incident)
        if district:
            district_counts[district] += 1

        status_counts[incident.status.value] += 1
        hour_counts[created_at.hour] += 1
        weekday_counts[created_at.weekday()] += 1

        if now - created_at <= timedelta(hours=24):
            incidents_last_24h += 1
        if now - created_at <= timedelta(days=7):
            incidents_last_7d += 1
        if incident.lat is not None and incident.lon is not None:
            incidents_with_coordinates += 1
        if is_urgent_incident(incident):
            urgent_incidents += 1
        if is_road_related_incident(incident):
            road_related_incidents += 1

        haystack = normalize_text(" ".join([incident.place or "", incident.description or "", incident.report or ""]))
        if any(keyword in haystack for keyword in ("autoestrada", "highway", "motorway", "a1", "a2", "a3", "a4", "a5", "a6", "a8", "a22", "a23", "a24", "a25")):
            motorway_signal_incidents += 1

        if len(recent_samples) < 8:
            recent_samples.append(
                RecentIncidentSample(
                    title=incident.title,
                    status=incident.status.value,
                    district=district,
                    place=incident.place,
                    created_at=created_at.isoformat(),
                )
            )

    by_district = [CountBucket(label=label, count=count) for label, count in district_counts.most_common()]
    by_status = [CountBucket(label=label, count=count) for label, count in status_counts.most_common()]
    by_hour = [CountBucket(label=f"{hour:02d}:00", count=hour_counts.get(hour, 0)) for hour in range(24)]
    by_weekday = [CountBucket(label=WEEKDAY_LABELS[index], count=weekday_counts.get(index, 0)) for index in range(7)]

    top_district, top_district_incidents = (by_district[0].label, by_district[0].count) if by_district else (None, 0)

    summary = IncidentStatisticsSummary(
        total_incidents=len(incidents),
        open_incidents=status_counts.get(IncidentStatus.ABERTO.value, 0),
        closed_incidents=status_counts.get(IncidentStatus.FECHADO.value, 0),
        urgent_incidents=urgent_incidents,
        incidents_last_24h=incidents_last_24h,
        incidents_last_7d=incidents_last_7d,
        road_related_incidents=road_related_incidents,
        motorway_signal_incidents=motorway_signal_incidents,
        incidents_with_coordinates=incidents_with_coordinates,
        incidents_without_coordinates=len(incidents) - incidents_with_coordinates,
        top_district=top_district,
        top_district_incidents=top_district_incidents,
    )

    return IncidentStatisticsResponse(
        generated_at=now,
        summary=summary,
        by_status=by_status,
        by_district=by_district,
        by_hour=by_hour,
        by_weekday=by_weekday,
        recent_incident_samples=recent_samples,
    )


def generate_statistics_ai_insights(
    statistics: IncidentStatisticsResponse,
    language: str = "pt",
) -> AIStatisticsInsights:
    language_code = language if language in SUPPORTED_STATISTICS_LANGUAGES else "pt"
    payload = {
        "summary": statistics.summary.model_dump(),
        "by_status": [bucket.model_dump() for bucket in statistics.by_status],
        "by_district": [bucket.model_dump() for bucket in statistics.by_district[:8]],
        "by_hour": [bucket.model_dump() for bucket in statistics.by_hour],
        "by_weekday": [bucket.model_dump() for bucket in statistics.by_weekday],
        "recent_incident_samples": [sample.model_dump() for sample in statistics.recent_incident_samples],
    }
    prompt = INCIDENT_STATISTICS_ANALYSIS_PROMPT.format(
        language_name=SUPPORTED_STATISTICS_LANGUAGES[language_code],
        payload=json.dumps(payload, ensure_ascii=False, indent=2),
    )

    response = generate_ai_response(prompt)
    cleaned = clean_ai_response(response)
    parsed = raw_text_2_json(cleaned)
    normalized = normalize_ai_statistics_payload(parsed)
    return AIStatisticsInsights.model_validate(normalized)


def normalize_ai_statistics_payload(payload: dict) -> dict:
    if not isinstance(payload, dict):
        return payload

    key_aliases = {
        "executive_summary": ("executive_summary", "resumo_executivo", "resumo"),
        "operational_pressure": ("operational_pressure", "pressao_operacional", "pressão_operacional"),
        "network_impact_summary": ("network_impact_summary", "impacto_operacional_rede", "resumo_impacto_rede"),
        "priority_districts": ("priority_districts", "distritos_prioritarios", "distritos_prioritários"),
        "risk_alerts": ("risk_alerts", "alertas_risco"),
        "executive_actions": ("executive_actions", "acoes_executivas", "ações_executivas", "acoes_prioritarias", "ações_prioritárias"),
        "operational_recommendations": ("operational_recommendations", "recomendacoes_operacionais", "recomendações_operacionais"),
        "emerging_patterns": ("emerging_patterns", "padroes_emergentes", "padrões_emergentes"),
        "data_quality_notes": ("data_quality_notes", "notas_qualidade_dados"),
    }

    normalized: dict[str, object] = {}
    for target_key, aliases in key_aliases.items():
        for alias in aliases:
            if alias in payload:
                normalized[target_key] = payload[alias]
                break

    pressure_aliases = {
        "baixa": "low",
        "baixo": "low",
        "low": "low",
        "moderada": "moderate",
        "moderado": "moderate",
        "moderate": "moderate",
        "alta": "high",
        "alto": "high",
        "high": "high",
    }
    pressure_raw = normalized.get("operational_pressure")
    if isinstance(pressure_raw, str):
        normalized["operational_pressure"] = pressure_aliases.get(pressure_raw.casefold(), pressure_raw.casefold())

    list_fields = (
        "priority_districts",
        "risk_alerts",
        "executive_actions",
        "operational_recommendations",
        "emerging_patterns",
        "data_quality_notes",
    )
    for field in list_fields:
        value = normalized.get(field)
        if value is None:
            continue
        if isinstance(value, list):
            normalized[field] = [str(item) for item in value]
        else:
            normalized[field] = [str(value)]

    return normalized


def build_statistics_cache_key(statistics: IncidentStatisticsResponse, language: str = "pt") -> str:
    language_code = language if language in SUPPORTED_STATISTICS_LANGUAGES else "pt"
    payload = {
        "language": language_code,
        "summary": statistics.summary.model_dump(),
        "by_status": [bucket.model_dump() for bucket in statistics.by_status],
        "by_district": [bucket.model_dump() for bucket in statistics.by_district[:10]],
        "by_hour": [bucket.model_dump() for bucket in statistics.by_hour],
        "by_weekday": [bucket.model_dump() for bucket in statistics.by_weekday],
        "recent_incident_samples": [sample.model_dump() for sample in statistics.recent_incident_samples],
    }
    return sha1(json.dumps(payload, ensure_ascii=False, sort_keys=True).encode("utf-8")).hexdigest()


def get_cached_statistics_ai_insights(cache_key: str) -> AIStatisticsInsights | None:
    with _ai_statistics_cache_lock:
        cached = _ai_statistics_cache.get(cache_key)
        if not cached:
            return None

        cached_at, insights = cached
        if datetime.now(timezone.utc) - cached_at > AI_STATISTICS_CACHE_TTL:
            _ai_statistics_cache.pop(cache_key, None)
            return None

        return insights


def cache_statistics_ai_insights(cache_key: str, insights: AIStatisticsInsights) -> None:
    with _ai_statistics_cache_lock:
        _ai_statistics_cache[cache_key] = (datetime.now(timezone.utc), insights)


def build_statistics_ai_response(
    statistics: IncidentStatisticsResponse,
    language: str = "pt",
) -> IncidentStatisticsAIResponse:
    language_code = language if language in SUPPORTED_STATISTICS_LANGUAGES else "pt"
    cache_key = build_statistics_cache_key(statistics, language_code)
    cached_insights = get_cached_statistics_ai_insights(cache_key)
    if cached_insights is not None:
        return IncidentStatisticsAIResponse(
            generated_at=datetime.now(timezone.utc),
            ai_enabled=True,
            ai_provider="gemini-2.5-flash",
            ai_insights=cached_insights,
            ai_error=None,
        )

    try:
        ai_insights = generate_statistics_ai_insights(statistics, language_code)
    except Exception as error:
        return IncidentStatisticsAIResponse(
            generated_at=datetime.now(timezone.utc),
            ai_enabled=False,
            ai_provider=None,
            ai_insights=None,
            ai_error=str(error),
        )

    cache_statistics_ai_insights(cache_key, ai_insights)
    return IncidentStatisticsAIResponse(
        generated_at=datetime.now(timezone.utc),
        ai_enabled=True,
        ai_provider="gemini-2.5-flash",
        ai_insights=ai_insights,
        ai_error=None,
    )
