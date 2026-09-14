"use client";

import React, { useState, Component, ErrorInfo, ReactNode } from 'react';

// --- TYPES ---
interface Resource {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  services: string[];
  languages: string[];
  massHealth: string;
  medicare: string;
  commercial: string;
  undocumented: string;
  telehealth: string;
}

// --- MOCK DATA ---
const mockData: Resource[] = [
  {
    id: '1',
    name: 'Community Care Center',
    address: '123 Main St, Boston, MA 02118',
    lat: 42.336,
    lng: -71.074,
    services: ['Therapy', 'Psychiatry'],
    languages: ['Spanish', 'English'],
    massHealth: 'Yes',
    medicare: 'Yes',
    commercial: 'Yes',
    undocumented: 'Yes',
    telehealth: 'Yes',
  },
  {
    id: '2',
    name: 'Downtown Behavioral Health',
    address: '450 Washington St, Boston, MA 02111',
    lat: 42.353,
    lng: -71.061,
    services: ['Therapy', 'Support Groups'],
    languages: ['English', 'Mandarin'],
    massHealth: 'Yes',
    medicare: 'Unknown',
    commercial: 'No',
    undocumented: 'Unknown',
    telehealth: 'Yes',
  },
  {
    id: '3',
    name: 'East Side Clinic',
    address: '88 Border St, East Boston, MA 02128',
    lat: 42.370,
    lng: -71.039,
    services: ['Case Management', 'Psychiatry'],
    languages: ['Spanish', 'Portuguese'],
    massHealth: 'Yes',
    medicare: 'Yes',
    commercial: 'Unknown',
    undocumented: 'Yes',
    telehealth: 'No',
  },
  {
    id: '4',
    name: 'Statewide Tele-Therapy',
    address: 'Virtual Only',
    lat: 42.360,
    lng: -71.058,
    services: ['Therapy', 'Crisis Care'],
    languages: ['English', 'Haitian Creole'],
    massHealth: 'Yes',
    medicare: 'No',
    commercial: 'No',
    undocumented: 'No',
    telehealth: 'Unknown',
  }
];

// --- ERROR BOUNDARY ---
interface ErrorBoundaryProps { children: ReactNode; }
interface ErrorBoundaryState { hasError: boolean; }

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(_error: Error): ErrorBoundaryState {
    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("App render error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-xl w-full bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-2xl font-bold text-[#1E396C] mb-4">Something went wrong.</h2>
            <p className="text-slate-600 mb-6">Please try reloading the page.</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 bg-[#1E396C] text-white px-6 py-2 rounded font-medium hover:bg-blue-900"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- ICONS ---
const Icons = {
  Check: () => <svg className="w-5 h-5 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  Cross: () => <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  Help: () => <svg className="w-5 h-5 text-[#1E396C]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  MapPin: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
};

// --- COMPONENTS ---
const StatusIndicator = ({ status, label }: { status: string; label: string }) => {
  if (status === 'Yes') return <div className="flex items-center"><Icons.Check /><span className="ml-2 text-sm">{label}</span></div>;
  if (status === 'No') return <div className="flex items-center line-through text-gray-500"><Icons.Cross /><span className="ml-2 text-sm">{label}</span></div>;
  return (
    <div className="flex items-start bg-blue-50/50 p-2 rounded-md">
      <div className="mt-0.5"><Icons.Help /></div>
      <span className="ml-2 text-sm text-slate-700"><strong>{label}</strong> not specified. Contact to confirm.</span>
    </div>
  );
};

const ResourceCard = ({ resource, isActive, onClick }: { resource: Resource; isActive: boolean; onClick: () => void }) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-lg border-2 p-5 cursor-pointer transition-all hover:shadow-md ${isActive ? 'border-[#1E396C] shadow-md' : 'border-gray-200'}`}
  >
    <h3 className="text-xl font-bold text-[#1E396C]">{resource.name}</h3>
    <p className="text-slate-600 flex items-center mt-1 text-sm"><Icons.MapPin /><span className="ml-1">{resource.address}</span></p>
    
    <div className="mt-4 flex flex-wrap gap-2">
      {resource.services.map((s: string) => (
        <span key={s} className="px-2 py-1 bg-gray-100 text-xs font-semibold text-slate-700 rounded uppercase tracking-wider">{s}</span>
      ))}
    </div>
    
    <div className="mt-4 space-y-2">
      <p className="text-sm"><strong>Languages:</strong> {resource.languages.join(', ')}</p>
      <div className="grid grid-cols-1 gap-2 pt-2 border-t border-gray-100">
        <StatusIndicator status={resource.massHealth} label="MassHealth" />
        <StatusIndicator status={resource.undocumented} label="Serves Regardless of Immigration Status" />
      </div>
    </div>
  </div>
);

const EmptyState = ({ resetFilters }: { resetFilters: () => void }) => (
  <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
    <h3 className="text-xl font-bold text-[#1E396C] mb-2">No matching resources found</h3>
    <p className="text-slate-600 mb-6">We couldn't find a provider matching every selected filter. Try broadening your search.</p>
    <button onClick={resetFilters} className="bg-[#1E396C] text-white px-6 py-2 rounded font-medium hover:bg-blue-900">
      Clear Filters
    </button>
  </div>
);

const MapPlaceholder = ({ resources, activeId, setActiveId }: { resources: Resource[]; activeId: string | null; setActiveId: (id: string | null) => void }) => {
  const project = (lat: number, lng: number) => {
    const latMin = 42.33, latMax = 42.38;
    const lngMin = -71.08, lngMax = -71.03;
    const y = 100 - ((lat - latMin) / (latMax - latMin)) * 100;
    const x = ((lng - lngMin) / (lngMax - lngMin)) * 100;
    return { top: `${y}%`, left: `${x}%` };
  };

  return (
    <div className="bg-slate-200 w-full h-[400px] rounded-lg border-2 border-slate-300 relative overflow-hidden flex items-center justify-center">
      <p className="absolute text-slate-500 font-medium z-0 text-center px-4">Interactive map prototype.<br/>(Will connect to Mapbox in production)</p>
      {resources.map((res) => {
        const pos = project(res.lat, res.lng);
        const isActive = res.id === activeId;
        return (
          <div 
            key={res.id}
            onClick={() => setActiveId(res.id)}
            className={`absolute w-6 h-6 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all z-10 ${isActive ? 'bg-[#D9272E] scale-125 border-2 border-white shadow-lg' : 'bg-[#1E396C] border-2 border-white'}`}
            style={{ top: pos.top, left: pos.left }}
          />
        );
      })}
    </div>
  );
};

// --- MAIN APP ---
export default function Home() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [language, setLanguage] = useState<string>('');
  const [insurance, setInsurance] = useState<string>('');

  const filteredData = mockData.filter(res => {
    if (language && !res.languages.includes(language)) return false;
    if (insurance === 'MassHealth' && res.massHealth === 'No') return false;
    if (insurance === 'Medicare' && res.medicare === 'No') return false;
    if (insurance === 'Commercial' && res.commercial === 'No') return false;
    return true;
  });

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        
        {/* Header */}
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

        {/* Crisis Banner */}
        <div className="bg-[#D9272E] text-white">
          <div className="max-w-7xl mx-auto px-4 py-3 text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between font-medium">
            <p>If you are in immediate danger, call <strong>911</strong>.</p>
            <p className="mt-1 sm:mt-0">For a mental health crisis, call or text <strong>988</strong> (Available 24/7 in English & Spanish).</p>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
          
          {/* Filters Sidebar */}
          <aside className="w-full md:w-80 flex-shrink-0 space-y-6">
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="font-bold text-lg text-[#1E396C] mb-4 border-b pb-2">Filter Resources</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-slate-700">Language Supported</label>
                  <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full border-gray-300 rounded-md p-2 bg-slate-50 border focus:ring-2 focus:ring-[#1E396C]"
                  >
                    <option value="">Any Language</option>
                    <option value="Spanish">Spanish</option>
                    <option value="Portuguese">Portuguese</option>
                    <option value="Haitian Creole">Haitian Creole</option>
                    <option value="Mandarin">Mandarin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1 text-slate-700">Insurance Accepted</label>
                  <select 
                    value={insurance} 
                    onChange={(e) => setInsurance(e.target.value)}
                    className="w-full border-gray-300 rounded-md p-2 bg-slate-50 border focus:ring-2 focus:ring-[#1E396C]"
                  >
                    <option value="">Any Insurance</option>
                    <option value="MassHealth">MassHealth</option>
                    <option value="Medicare">Medicare</option>
                    <option value="Commercial">Commercial / Private</option>
                  </select>
                </div>
              </div>
            </div>
          </aside>

          {/* Map & Results Area */}
          <div className="flex-1 flex flex-col gap-6">
            <MapPlaceholder resources={filteredData} activeId={activeId} setActiveId={setActiveId} />
            
            <div>
              <div className="flex justify-between items-end mb-4">
                <h2 className="font-bold text-2xl text-[#1E396C]">Directory Results</h2>
                <span className="text-slate-500 font-medium">{filteredData.length} resource{filteredData.length !== 1 ? 's' : ''}</span>
              </div>
              
              {filteredData.length === 0 ? (
                <EmptyState resetFilters={() => { setLanguage(''); setInsurance(''); }} />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredData.map(res => (
                    <ResourceCard 
                      key={res.id} 
                      resource={res} 
                      isActive={activeId === res.id} 
                      onClick={() => setActiveId(res.id)} 
                    />
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