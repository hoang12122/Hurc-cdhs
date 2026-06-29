import type { RailLineModel, RailStationNode } from './rail-network-data';

const GOOGLE_MAPS_BASE_URL = 'https://www.google.com/maps';

function normalizeQuery(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

export function createStationGoogleMapsQuery(station: RailStationNode, line?: RailLineModel) {
  const lineText = line ? `${line.code} ${line.name}` : station.lineIds.join(' ');
  return normalizeQuery(`Ga ${station.name} ${lineText} Thành phố Hồ Chí Minh Việt Nam`);
}

export function createGoogleMapsSearchUrl(station: RailStationNode, line?: RailLineModel) {
  const query = createStationGoogleMapsQuery(station, line);
  return `${GOOGLE_MAPS_BASE_URL}/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function createGoogleMapsDirectionsUrl(station: RailStationNode, line?: RailLineModel) {
  const query = createStationGoogleMapsQuery(station, line);
  return `${GOOGLE_MAPS_BASE_URL}/dir/?api=1&destination=${encodeURIComponent(query)}`;
}

export function createGoogleMapsPlaceUrl(placeId: string) {
  return `${GOOGLE_MAPS_BASE_URL}/search/?api=1&query_place_id=${encodeURIComponent(placeId)}`;
}
