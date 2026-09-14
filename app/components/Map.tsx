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
  phone?: string;
  website?: string;
  services: string[];
  languages: string[];
  massHealth: string;
  undocumented: string;
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
              <div className="min-w-[200px]">
                <strong className="text-base text-[#1E396C] block mb-2">{res.name}</strong>
                
                <a href={`https://maps.google.com/?q=${encodeURIComponent(res.address)}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline block mb-1">
                  📍 {res.address}
                </a>
                
                {res.phone && (
                  <a href={`tel:${res.phone}`} className="text-sm text-blue-600 hover:underline block mb-1">
                    📞 {res.phone}
                  </a>
                )}
                
                {res.website && (
                  <a href={res.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline block mb-2">
                    🌐 Visit Website
                  </a>
                )}
                
                <div className="mt-2 text-xs text-gray-600 border-t pt-2">
                  <strong>Languages:</strong> {res.languages.join(', ')}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}