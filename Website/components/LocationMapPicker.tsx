"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useMemo } from "react";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(event) {
      onPick(event.latlng.lat, event.latlng.lng);
    }
  });

  return null;
}

export default function LocationMapPicker({
  lat,
  lng,
  onPick
}: {
  lat: number;
  lng: number;
  onPick: (lat: number, lng: number) => void;
}) {
  const center = useMemo<[number, number]>(() => [lat, lng], [lat, lng]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <MapContainer center={center} zoom={13} scrollWheelZoom style={{ height: 260, width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center} icon={markerIcon} />
        <MapClickHandler onPick={onPick} />
      </MapContainer>
      <div className="border-t border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
        Click anywhere on the map to set exact latitude and longitude.
      </div>
    </div>
  );
}
