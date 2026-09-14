"use client";

import React, { useState, useEffect, Component, ReactNode } from 'react';
import dynamic from 'next/dynamic';
import Papa from 'papaparse';

const MapComponent = dynamic(() => import('./components/Map'), { 
  ssr: false, 
  loading: () => <div className="bg-slate-200 w-full h-[400px] rounded-lg flex items-center justify-center font-medium text-slate-500">Loading Map...</div> 
});

interface Resource {
  id: string; name: string; address: string; lat: number; lng: number;
  phone?: string; website?: string;
  services: string[]; languages: string[]; massHealth: string;
  medicare: string; commercial: string; undocumented: string; telehealth: string;
}

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
};

class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean}> {
  constructor(props: any) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div className="p-8 text-center"><h2 className="text-xl font-bold text-red-600">Something went wrong. Please refresh.</h2></div>;
    return this.props.children;
  }
}

const Icons = {
  Check: () => <svg className="w-5 h-5 text-green-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  Cross: () => <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  Help: () => <svg className="w-5 h-5 text-[#1E396C] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  MapPin: () => <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Phone: () => <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  Globe: () => <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
};

const StatusIndicator = ({ status, label }: { status: string; label: string }) => {
  if (status === 'Yes' || status === 'y' || status === 'yes') return <div className="flex items-center"><Icons.Check /><span className="ml-2 text-sm">{label}</span></div>;
  if (status === 'No' || status === 'n' || status === 'no') return <div className="flex items-center line-through text-gray-500"><Icons.Cross /><span className="ml-2 text-sm">{label}</span></div>;
  return (
    <div className="flex items-start bg-blue-50/50 p-2 rounded-md">
      <div className="mt-0.5"><Icons.Help /></div>
      <span className="ml-2 text-sm text-slate-700"><strong>{label}</strong> not specified.</span>
    </div>
  );
};

export default function Home() {
  const [realData, setRealData] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const [language, setLanguage] = useState('');
  const [insurance, setInsurance] = useState('');
  const [zipInput, setZipInput] = useState('');
  const [radius, setRadius] = useState('5');
  const [searchCenter, setSearchCenter] = useState<[number, number]>([42.3601, -71.0589]);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch from Google Sheets on load
  useEffect(() => {
    const csvUrl = "/directory.csv";
    
    Papa.parse(csvUrl, {
      download: true,
      header: true,
      complete: (results) => {
        const parsedData = results.data
          .filter((row: any) => row.Org_Name) 
          .map((row: any, idx: number) => {
            const hasLat = row.Latitude && row.Latitude.trim() !== "";
            // Temporarily scatter pins slightly around central Mass if missing coordinates
            const scatterLat = 42.36 + (Math.random() * 0.4 - 0.2);
            const scatterLng = -71.06 + (Math.random() * 0.4 - 0.2);

            return {
              id: idx.toString(),
              name: row.Org_Name || "Unknown Organization",
              address: `${row.Main_Address_Line1 || ''}, ${row.City_Town || ''}, MA ${row.ZIP || ''}`,
              lat: hasLat ? parseFloat(row.Latitude) : scatterLat,
              lng: hasLat ? parseFloat(row.Longitude) : scatterLng,
              phone: row.Main_Phone,
              website: row.Website,
              services: row.Service_Modalities ? row.Service_Modalities.split(';') : [],
              languages: row.Languages_Spoken_By_Staff_Other_Than_English ? row.Languages_Spoken_By_Staff_Other_Than_English.split(';') : [],
              massHealth: row.Accepts_MassHealth || "Unknown",
              medicare: row.Accepts_Medicare || "Unknown",
              commercial: row.Accepts_Commercial_Insurance || "Unknown",
              undocumented: row.Serves_Regardless_of_Immigration_Status || "Unknown",
              telehealth: row.Telehealth_Available || "Unknown"
            };
          });
        setRealData(parsedData);
        setIsLoading(false);
      }
    });
  }, []);

  const handleZipSearch = async () => {
    if (!zipInput || zipInput.length < 5) return;
    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?postalcode=${zipInput}&country=US&format=json`);
      const data = await res.json();
      if (data && data.length > 0) {
        setSearchCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      } else {
        alert("ZIP code not found. Showing all results.");
      }
    } catch (e) {
      console.error(e);
    }
    setIsSearching(false);
  };

  const filteredData = realData.filter(res => {
    if (language && !res.languages.some(l => l.toLowerCase().includes(language.toLowerCase()) || l.toLowerCase().includes('multiple'))) return false;
    if (insurance === 'MassHealth' && (res.massHealth === 'No' || res.massHealth === 'n' || res.massHealth === 'no')) return false;
    if (insurance === 'Medicare' && (res.medicare === 'No' || res.medicare === 'n' || res.medicare === 'no')) return false;
    if (insurance === 'Commercial' && (res.commercial === 'No' || res.commercial === 'n' || res.commercial === 'no')) return false;
    if (zipInput.length >= 5) {
      const distance = getDistance(searchCenter[0], searchCenter[1], res.lat, res.lng);
      if (distance > parseInt(radius)) return false;
    }
    return true;
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans"><p className="text-xl font-bold text-[#1E396C] animate-pulse">Loading Live Directory Data...</p></div>;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1E396C] rounded flex items-center justify-center text-white font-bold text-xl">M</div>
              <div>
                <h1 className="font-extrabold text-xl text-[#1E396C] leading-tight">MIRA Coalition</h1>
                <p className="text-xs text-[#D9272E] font-bold tracking-widest uppercase">Resource Navigator</p>
              </div>
            </div>
          </div>
        </header>

        <div className="bg-[#D9272E] text-white">
          <div className="max-w-7xl mx-auto px-4 py-3 text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between font-medium">
            <p>If you are in immediate danger, call <strong>911</strong>.</p>
            <p className="mt-1 sm:mt-0">For a mental health crisis, call or text <strong>988</strong> (Available 24/7).</p>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
          <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="font-bold text-lg text-[#1E396C] mb-4 border-b pb-2">Find Care</h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-slate-700">Location</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="ZIP Code" 
                      maxLength={5}
                      value={zipInput}
                      onChange={(e) => setZipInput(e.target.value.replace(/\D/g, ''))}
                      className="w-2/3 border-gray-300 rounded-md p-2 bg-slate-50 border focus:ring-2 focus:ring-[#1E396C]"
                    />
                    <select 
                      value={radius} 
                      onChange={(e) => setRadius(e.target.value)}
                      className="w-1/3 border-gray-300 rounded-md p-2 bg-slate-50 border focus:ring-2 focus:ring-[#1E396C] text-sm"
                    >
                      <option value="5">5 mi</option>
                      <option value="10">10 mi</option>
                      <option value="25">25 mi</option>
                    </select>
                  </div>
                  <button 
                    onClick={handleZipSearch}
                    disabled={zipInput.length < 5 || isSearching}
                    className="w-full mt-2 bg-[#1E396C] text-white text-sm font-medium py-2 rounded disabled:opacity-50"
                  >
                    {isSearching ? 'Locating...' : 'Update Map'}
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1 text-slate-700">Language Supported</label>
                  <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full border-gray-300 rounded-md p-2 bg-slate-50 border focus:ring-2 focus:ring-[#1E396C]">
                    <option value="">Any Language</option>
                    <option value="Spanish">Spanish</option>
                    <option value="Portuguese">Portuguese</option>
                    <option value="Haitian Creole">Haitian Creole</option>
                    <option value="Vietnamese">Vietnamese</option>
                    <option value="Cambodian">Cambodian / Khmer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1 text-slate-700">Insurance Accepted</label>
                  <select value={insurance} onChange={(e) => setInsurance(e.target.value)} className="w-full border-gray-300 rounded-md p-2 bg-slate-50 border focus:ring-2 focus:ring-[#1E396C]">
                    <option value="">Any Insurance</option>
                    <option value="MassHealth">MassHealth</option>
                    <option value="Medicare">Medicare</option>
                    <option value="Commercial">Commercial / Private</option>
                  </select>
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1 flex flex-col gap-6">
            <MapComponent resources={filteredData} activeId={activeId} setActiveId={setActiveId} center={searchCenter} />
            
            <div>
              <div className="flex justify-between items-end mb-4">
                <h2 className="font-bold text-2xl text-[#1E396C]">Directory Results</h2>
                <span className="text-slate-500 font-medium">{filteredData.length} resource{filteredData.length !== 1 ? 's' : ''}</span>
              </div>
              
              {filteredData.length === 0 ? (
                <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                  <h3 className="text-xl font-bold text-[#1E396C] mb-2">No matching resources found</h3>
                  <button onClick={() => { setLanguage(''); setInsurance(''); setZipInput(''); }} className="bg-[#1E396C] text-white px-6 py-2 rounded font-medium mt-4">Clear Filters</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {filteredData.slice(0, 100).map(res => (
                    <div 
                      key={res.id} 
                      onClick={() => setActiveId(res.id)}
                      className={`bg-white rounded-lg border-2 p-5 cursor-pointer transition-all ${activeId === res.id ? 'border-[#1E396C] shadow-md ring-1 ring-[#1E396C]' : 'border-gray-200'}`}
                    >
                      <h3 className="text-lg font-bold text-[#1E396C]">{res.name}</h3>
                      
                      <div className="mt-3 space-y-2">
                        <a href={`https://maps.google.com/?q=${encodeURIComponent(res.address)}`} target="_blank" rel="noopener noreferrer" className="flex items-start text-sm text-blue-600 hover:underline hover:text-blue-800">
                          <Icons.MapPin />
                          <span>{res.address}</span>
                        </a>
                        
                        {res.phone && (
                          <a href={`tel:${res.phone}`} className="flex items-center text-sm text-blue-600 hover:underline hover:text-blue-800">
                            <Icons.Phone />
                            <span>{res.phone}</span>
                          </a>
                        )}
                        
                        {res.website && (
                          <a href={res.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-blue-600 hover:underline hover:text-blue-800">
                            <Icons.Globe />
                            <span className="truncate">Visit Website</span>
                          </a>
                        )}
                      </div>
                      
                      {res.services.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {res.services.slice(0, 3).map((s, i) => <span key={i} className="px-2 py-1 bg-gray-100 text-xs font-semibold text-slate-700 rounded">{s}</span>)}
                        </div>
                      )}
                      
                      <div className="mt-4 space-y-2 pt-3 border-t border-gray-100">
                        {res.languages.length > 0 && <p className="text-sm"><strong>Languages:</strong> {res.languages.join(', ')}</p>}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <StatusIndicator status={res.massHealth} label="MassHealth" />
                          <StatusIndicator status={res.undocumented} label="Undocumented Eligible" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}