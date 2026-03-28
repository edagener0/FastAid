import type { Dispatch, SetStateAction } from 'react';

export type Language = 'pt' | 'en';

export interface Incident {
  id: string;
  title: string;
  description: string;
  lat: number | null;
  lon: number | null;
  place: string | null;
  phone: string;
  transcription: string;
  report: string;
  status: 'aberto' | 'fechado';
  created_at: string;
  updated_at: string;
}

export interface CountBucket {
  label: string;
  count: number;
}

export interface IncidentStatisticsSummary {
  total_incidents: number;
  open_incidents: number;
  closed_incidents: number;
  urgent_incidents: number;
  incidents_last_24h: number;
  incidents_last_7d: number;
  road_related_incidents: number;
  motorway_signal_incidents: number;
  incidents_with_coordinates: number;
  incidents_without_coordinates: number;
  top_district: string | null;
  top_district_incidents: number;
}

export interface AIStatisticsInsights {
  executive_summary: string;
  operational_pressure: 'low' | 'moderate' | 'high';
  risk_alerts: string[];
  operational_recommendations: string[];
  emerging_patterns: string[];
  data_quality_notes: string[];
}

export interface IncidentStatisticsResponse {
  generated_at: string;
  summary: IncidentStatisticsSummary;
  by_status: CountBucket[];
  by_district: CountBucket[];
  by_hour: CountBucket[];
  by_weekday: CountBucket[];
  ai_enabled: boolean;
  ai_provider: string | null;
  ai_insights: AIStatisticsInsights | null;
}

export interface RootOutletContext {
  searchQuery: string;
  language: Language;
  selectedDistricts: string[];
  setSelectedDistricts: Dispatch<SetStateAction<string[]>>;
}
