from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class CountBucket(BaseModel):
    label: str
    count: int


class IncidentStatisticsSummary(BaseModel):
    total_incidents: int
    open_incidents: int
    closed_incidents: int
    urgent_incidents: int
    incidents_last_24h: int
    incidents_last_7d: int
    road_related_incidents: int
    motorway_signal_incidents: int
    incidents_with_coordinates: int
    incidents_without_coordinates: int
    top_district: str | None = None
    top_district_incidents: int = 0


class RecentIncidentSample(BaseModel):
    title: str
    status: str
    district: str | None = None
    place: str | None = None
    created_at: str


class AIStatisticsInsights(BaseModel):
    executive_summary: str
    operational_pressure: Literal["low", "moderate", "high"]
    network_impact_summary: str
    priority_districts: list[str] = Field(default_factory=list)
    risk_alerts: list[str] = Field(default_factory=list)
    executive_actions: list[str] = Field(default_factory=list)
    operational_recommendations: list[str] = Field(default_factory=list)
    emerging_patterns: list[str] = Field(default_factory=list)
    data_quality_notes: list[str] = Field(default_factory=list)


class IncidentStatisticsResponse(BaseModel):
    generated_at: datetime
    summary: IncidentStatisticsSummary
    by_status: list[CountBucket]
    by_district: list[CountBucket]
    by_hour: list[CountBucket]
    by_weekday: list[CountBucket]
    recent_incident_samples: list[RecentIncidentSample] = Field(default_factory=list, exclude=True)


class IncidentStatisticsAIResponse(BaseModel):
    generated_at: datetime
    ai_enabled: bool
    ai_provider: str | None = None
    ai_insights: AIStatisticsInsights | None = None
    ai_error: str | None = None
