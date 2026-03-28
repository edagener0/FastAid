import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { MapContainer, Marker, Popup, TileLayer, ZoomControl, useMap } from 'react-leaflet';

import { useUserLocation } from '../hooks/useUserLocation';
import { buildIncidentRouteUrl, formatRelativeTime, getIncidentCoordinates } from '../lib/incidents';
import type { Incident } from '../types/incidents';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
});

const UserIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [35, 51],
  iconAnchor: [17, 51],
  popupAnchor: [0, -51],
  className: 'user-location-marker',
});

L.Marker.prototype.options.icon = DefaultIcon;

function MapController({ center }: { center: [number, number] | null }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, 14, { animate: true });
    }
  }, [center, map]);

  return null;
}

interface MapProps {
  incidents: Incident[];
  selectedIncidentId?: string | null;
}

function Map({ incidents, selectedIncidentId = null }: MapProps) {
  const { userLocation } = useUserLocation();
  const initialCenter: [number, number] = [38.7223, -9.1393];
  const selectedIncident = incidents.find((incident) => incident.id === selectedIncidentId) ?? null;
  const selectedCoordinates = selectedIncident ? getIncidentCoordinates(selectedIncident) : null;

  return (
    <div className="map-shell h-full w-full">
      <MapContainer
        center={initialCenter}
        zoom={13}
        zoomControl={false}
        attributionControl={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />
        <MapController center={selectedCoordinates ?? userLocation} />

        {userLocation && (
          <Marker key="user-location" position={userLocation} icon={UserIcon}>
            <Popup>
              <div className="text-center">
                <strong>Voce esta aqui</strong>
                <br />
                <span className="text-sm text-gray-600">Localizacao atual</span>
              </div>
            </Popup>
          </Marker>
        )}

        {incidents.map((incident) => {
          const coordinates = getIncidentCoordinates(incident);
          if (!coordinates) {
            return null;
          }

          return (
            <Marker
              key={`incident-${incident.id}`}
              position={coordinates}
              icon={DefaultIcon}
            >
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default Map;
