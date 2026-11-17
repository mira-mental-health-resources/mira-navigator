"use client";

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, 12);
  return null;
}

export default function Map({ resources, activeId, setActiveId, center }: any) {
  return (
    <div className="w-full h-[400px] md:h-[600px] rounded-xl overflow-hidden shadow-sm border border-slate-200 z-10 sticky top-24">
      <MapContainer center={center} zoom={12} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <ChangeView center={center} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {resources.map((res: any) => (
          <Marker 
            key={res.id} 
            position={[res.lat, res.lng]}
            eventHandlers={{ click: () => setActiveId(res.id) }}
          >
            <Popup>
              <div className="font-sans">
                <strong className="block text-[#0f284e] mb-1">{res.name}</strong>
                <span className="text-sm text-slate-600 block">{res.address.split(',')[0]}</span>
                <button onClick={() => setActiveId(res.id)} className="mt-2 text-xs font-bold text-[#4eb5b1]">View Details</button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}