"use client";

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

const ChangeView = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 12);
  }, [center, map]);
  return null;
};

interface Resource {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

interface MapProps {
  resources: Resource[];
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  center: [number, number];
}

export default function Map({ resources, activeId, setActiveId, center }: MapProps) {
  return (
    <div className="w-full h-[400px] rounded-lg border-2 border-slate-300 overflow-hidden relative z-0">
      <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView center={center} />
        
        {resources.map((res) => (
          <Marker 
            key={res.id} 
            position={[res.lat, res.lng]}
            eventHandlers={{ click: () => setActiveId(res.id) }}
          >
            <Popup>
              <strong>{res.name}</strong><br/>
              <span className="text-sm text-gray-600">{res.address}</span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}