from db.session import SessionDep
from .models import Incident
from typing import Annotated
from fastapi import Query, HTTPException
from sqlmodel import select
import uuid
from fastapi import APIRouter

router = APIRouter()

@router.get("")
def get_incidents(
    session: SessionDep, 
    offset: int = 0, 
    limit: Annotated[int, Query(le=10)] = 10
) -> list[Incident]:
    
    incidents = session.exec(
        select(Incident).offset(offset).limit(limit)
    ).all()

    return incidents

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