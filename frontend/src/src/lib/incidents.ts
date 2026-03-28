import type { Incident } from '../types/incidents';

const DEFAULT_API_BASE_URL = '/api';
const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const apiBaseUrl = (rawApiBaseUrl && rawApiBaseUrl.length > 0 ? rawApiBaseUrl : DEFAULT_API_BASE_URL).replace(/\/$/, '');

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`);

  if (!response.ok) {
    throw new Error(`Pedido falhou com o estado ${response.status}.`);
  }

  return response.json() as Promise<T>;
}

export function fetchIncidents(limit = 100): Promise<Incident[]> {
  return request<Incident[]>(`/incidents?limit=${limit}`);
}

export function fetchIncident(incidentId: string): Promise<Incident> {
  return request<Incident>(`/incidents/${incidentId}`);
}

export function getIncidentCoordinates(incident: Incident): [number, number] | null {
  if (incident.lat === null || incident.lon === null) {
    return null;
  }

  return [incident.lat, incident.lon];
}

export function buildIncidentRouteUrl(coordinates: [number, number]): string {
  const [lat, lon] = coordinates;
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
}

export function formatRelativeTime(dateInput: string): string {
  const date = new Date(dateInput);
  const diffMs = Date.now() - date.getTime();

  if (Number.isNaN(date.getTime())) {
    return 'Agora mesmo';
  }

  const diffMinutes = Math.max(1, Math.floor(diffMs / 60000));

  if (diffMinutes < 60) {
    return `há ${diffMinutes} min`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return diffHours === 1 ? 'há 1 h' : `há ${diffHours} h`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return diffDays === 1 ? 'há 1 dia' : `há ${diffDays} dias`;
}

export function formatAbsoluteDate(dateInput: string): string {
  const date = new Date(dateInput);

  if (Number.isNaN(date.getTime())) {
    return 'Data indisponivel';
  }

  return new Intl.DateTimeFormat('pt-PT', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function calculateDistanceKm(
  origin: [number, number],
  destination: [number, number],
): number {
  const earthRadiusKm = 6371;
  const dLat = degreesToRadians(destination[0] - origin[0]);
  const dLon = degreesToRadians(destination[1] - origin[1]);
  const originLat = degreesToRadians(origin[0]);
  const destinationLat = degreesToRadians(destination[0]);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(originLat) * Math.cos(destinationLat) * Math.sin(dLon / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getIncidentPriority(incident: Incident): 'high' | 'medium' | 'low' {
  if (incident.status === 'fechado') {
    return 'low';
  }

  const createdAt = new Date(incident.created_at);
  if (Number.isNaN(createdAt.getTime())) {
    return 'medium';
  }

  const diffHours = (Date.now() - createdAt.getTime()) / 3600000;

  if (diffHours <= 2) {
    return 'high';
  }

  if (diffHours <= 8) {
    return 'medium';
  }

  return 'low';
}

function degreesToRadians(value: number): number {
  return (value * Math.PI) / 180;
}
