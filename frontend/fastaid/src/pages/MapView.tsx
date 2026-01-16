import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import api from "../api/axios";
import { type Ocorrencia } from "../types/Ocorrencia";

import L from "leaflet";

export const redIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});


export default function MapView() {
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);

  useEffect(() => {
    api.get("/incidents/")
      .then(res => setOcorrencias(res.data))
      .catch(console.error);
  }, []);

  return (
    <MapContainer
      center={[38.7223, -9.1393]}
      zoom={7}
      className="h-[70vh] w-full rounded"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {ocorrencias
        .filter(o => o.latitude && o.longitude && o.estado !== "RESOLVIDA" && o.estado !== "CANCELADA")
        .map(o => (
          <Marker
            key={o.id}
            position={[o.latitude, o.longitude]}
            icon={redIcon}
          >
            <Popup>
              <strong>{o.titulo}</strong><br />
              Estado: {o.estado}<br />
              Distrito: {o.distrito}
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}
