import type { Dispatch, SetStateAction } from 'react';

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

export interface RootOutletContext {
  searchQuery: string;
  selectedDistricts: string[];
  setSelectedDistricts: Dispatch<SetStateAction<string[]>>;
}
