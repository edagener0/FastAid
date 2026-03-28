import { getIncidentCoordinates } from './incidents';
import type { Incident } from '../types/incidents';

const DISTRICT_KEYWORDS = [
  { district: 'Aveiro', keywords: ['aveiro', 'agueda', 'espinho', 'ovar'] },
  { district: 'Beja', keywords: ['beja', 'aljustrel', 'mertola', 'serpa', 'ourique', 'odemira'] },
  { district: 'Braga', keywords: ['braga', 'guimaraes', 'guimarães', 'famalicao', 'famalicão', 'barcelos'] },
  { district: 'Bragança', keywords: ['braganca', 'bragança', 'mirandela', 'mogadouro'] },
  { district: 'Castelo Branco', keywords: ['castelo branco', 'covilha', 'covilhã', 'fundao', 'fundão'] },
  { district: 'Coimbra', keywords: ['coimbra', 'figueira da foz', 'arganil', 'mealhada'] },
  { district: 'Évora', keywords: ['evora', 'évora', 'estremoz', 'reguengos', 'montemor-o-novo', 'alentejo'] },
  { district: 'Faro', keywords: ['faro', 'albufeira', 'portimao', 'portimão', 'lagos', 'olhao', 'olhão'] },
  { district: 'Guarda', keywords: ['guarda', 'seia', 'manteigas'] },
  { district: 'Leiria', keywords: ['leiria', 'alcobaca', 'alcobaça', 'nazare', 'nazaré', 'peniche'] },
  { district: 'Lisboa', keywords: ['lisboa', 'lisbon', 'cascais', 'sintra', 'amadora', 'oeiras'] },
  { district: 'Portalegre', keywords: ['portalegre', 'elvas', 'ponte de sor', 'campo maior'] },
  { district: 'Porto', keywords: ['porto', 'gaia', 'vila nova de gaia', 'maia', 'matosinhos', 'gondomar'] },
  { district: 'Santarém', keywords: ['santarem', 'santarém', 'tomar', 'fatima', 'fátima', 'abrantes'] },
  { district: 'Setúbal', keywords: ['setubal', 'setúbal', 'almada', 'barreiro', 'seixal', 'montijo', 'sesimbra'] },
  { district: 'Viana do Castelo', keywords: ['viana do castelo', 'ponte de lima', 'valenca', 'valença'] },
  { district: 'Vila Real', keywords: ['vila real', 'chaves', 'peso da regua', 'peso da régua'] },
  { district: 'Viseu', keywords: ['viseu', 'lamego', 'tondela'] },
] as const;

export function normalizeText(value: string | null): string {
  return (value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function inferDistrictFromCoordinates(coordinates: [number, number] | null): string | null {
  if (!coordinates) {
    return null;
  }

  const [lat, lon] = coordinates;

  if (lat < 37.45) return 'Faro';
  if (lat > 41.6 && lon < -8.1) return 'Viana do Castelo';
  if (lat > 41.2 && lon > -7.6) return 'Bragança';
  if (lat > 41.2) return 'Braga';
  if (lat > 40.9 && lon > -7.6) return 'Vila Real';
  if (lat > 40.35 && lon > -7.7) return 'Guarda';
  if (lat > 40.35 && lon > -8.35) return 'Viseu';
  if (lat > 40.35) return 'Aveiro';
  if (lat > 39.85 && lon > -7.95) return 'Castelo Branco';
  if (lat > 39.55) return 'Coimbra';
  if (lat > 39.15 && lon <= -8.45) return 'Leiria';
  if (lat > 39.05 && lon > -7.95) return 'Portalegre';
  if (lat > 38.7 && lon <= -8.6) return 'Lisboa';
  if (lat > 38.7) return 'Santarém';
  if (lat > 38.45 && lon > -8.35) return 'Évora';
  if (lat > 38.45) return 'Setúbal';
  if (lat > 37.45 && lon > -8.45) return 'Beja';
  if (lat > 37.45) return 'Setúbal';

  return null;
}

export function inferIncidentDistrict(incident: Incident): string | null {
  const normalizedPlace = normalizeText(incident.place);

  for (const entry of DISTRICT_KEYWORDS) {
    if (entry.keywords.some((keyword) => normalizedPlace.includes(normalizeText(keyword)))) {
      return entry.district;
    }
  }

  return inferDistrictFromCoordinates(getIncidentCoordinates(incident));
}
