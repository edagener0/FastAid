import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapView() {
  return (
    <MapContainer
      center={[38.7223, -9.1393]}
      zoom={7}
      className="h-[70vh]"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <Marker position={[38.72, -9.13]}>
        <Popup>Incêndio – Alta Prioridade</Popup>
      </Marker>
    </MapContainer>
  );
}
