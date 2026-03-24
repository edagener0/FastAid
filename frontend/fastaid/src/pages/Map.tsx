import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { MapContainer, Marker, Popup, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import { mockOccurrences } from '../data/mockOccurrences';
import React from 'react';

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
  showOccurrences?: boolean;
}

function Map({ showOccurrences = true }: MapProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const initialCenter: [number, number] = [38.7223, -9.1393];

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.log('Erro ao obter localizacao:', error);
      }
    );
  }, []);

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
        <MapController center={userLocation} />

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

        {showOccurrences &&
          mockOccurrences.map((occurrence) => (
            <Marker
              key={`occurrence-${occurrence.id}`}
              position={occurrence.coordinates}
              icon={DefaultIcon}
            >
              <Popup>
                <div className="min-w-[170px]">
                  <strong className="text-cyan-700">{occurrence.type}</strong>
                  <br />
                  <span className="text-xs text-gray-500">{occurrence.time}</span>
                  <p className="mt-2 text-sm text-slate-600">{occurrence.description}</p>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}

export default Map;
