import uuid
from sqlmodel import Field, SQLModel
import enum
from datetime import datetime, timezone

class IncidentStatus(str, enum.Enum):
    ABERTO = "aberto"
    FECHADO = "fechado"

class Incident(SQLModel, table=True):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(nullable=False, max_length=100)
    description: str = Field(nullable=False, max_length=200)
    lat: float | None = Field(nullable=True)
    lon: float | None = Field(nullable=True)
    place: str | None = Field(nullable=True)
    phone: str = Field(nullable=False, regex=r"^\+?[1-9][0-9]{7,14}$")
    transcription: str = Field(nullable=False)
    report: str = Field(nullable=False)
    status: IncidentStatus = Field(default=IncidentStatus.ABERTO)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))



