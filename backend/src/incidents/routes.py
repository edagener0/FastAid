from db.session import SessionDep
from .models import Incident
from .services import build_incident_statistics, generate_statistics_ai_insights
from .statistics import IncidentStatisticsResponse
from typing import Annotated
from fastapi import Query, HTTPException
from sqlmodel import desc, select
import uuid
from fastapi import APIRouter

router = APIRouter()

@router.get("")
def get_incidents(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 100,
):
    incidents = session.exec(
        select(Incident)
        .order_by(desc(Incident.created_at))
        .offset(offset)
        .limit(limit)
    ).all()
    
    return incidents


@router.get("/statistics", response_model=IncidentStatisticsResponse)
def get_incident_statistics(
    session: SessionDep,
) -> IncidentStatisticsResponse:
    incidents = session.exec(
        select(Incident)
        .order_by(desc(Incident.created_at))
    ).all()

    statistics = build_incident_statistics(incidents)

    try:
        ai_insights = generate_statistics_ai_insights(statistics)
    except Exception:
        return statistics

    return statistics.model_copy(
        update={
            "ai_enabled": True,
            "ai_provider": "gemini-2.5-flash",
            "ai_insights": ai_insights,
        }
    )

@router.get("/{incident_id}")
def get_incident(
    incident_id: uuid.UUID,
    session: SessionDep
) -> Incident:
    
    incident = session.get(Incident, incident_id)

    if not incident:
        raise HTTPException(
            status_code=404,
            detail="Incident Not Found"
        )
    
    return incident
