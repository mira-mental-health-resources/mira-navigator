"use client";

import React, { useState, useMemo, Component } from 'react';

// MOCK DATA: 4 simulated records for preview purposes only. 
const mockData = [
  {
    id: 'res-1',
    name: 'Boston Community Health Center',
    address: '100 Blue Hill Ave',
    city: 'Boston',
    zip: '02119',
    lat: 42.32,
    lng: -71.08,
    phone: '(617) 555-0100',
    website: 'https://example.org/bchc',
    services: ['Therapy', 'Psychiatry', 'Case Management'],
    languages: ['Spanish', 'Haitian Creole'],
    massHealth: 'Yes',
    medicare: 'Yes',
    commercial: 'Yes',
    undocumented: 'Yes',
    telehealth: 'Yes',
  },
  {
    id: 'res-2',
    name: 'North Shore Wellness Clinic',
    address: '45 Essex St',
    city: 'Lynn',
    zip: '01902',
    lat: 42.46,
    lng: -70.94,
    phone: '(781) 555-0222',
    website: 'https://example.org/nswc',
    services: ['Therapy', 'Support Groups'],
    languages: ['Portuguese'],
    massHealth: 'Unknown',
    medicare: 'Unknown',
    commercial: 'Yes',
    undocumented: 'Unknown',
    telehealth: 'No',
  },
  {
    id: 'res-3',
    name: 'Statewide Virtual Counseling Network',
    address: 'Telehealth Only',
    city: 'Statewide',
    zip: '00000',
    lat: 42.4,
    lng: -71.5,
    phone: '(800) 555-0333',
    website: 'https://example.org/svcn',
    services: ['Therapy', 'Psychiatry'],
    languages: ['Spanish', 'Mandarin', 'Vietnamese'],
    massHealth: 'Yes',
    medicare: 'Yes',
    commercial: 'Unknown',
    undocumented: 'Yes',
    telehealth: 'Yes',
  },
  {
    id: 'res-4',
    name: 'Worcester Family Support Center',
    address: '200 Main St',
    city: 'Worcester',
    zip: '01608',
    lat: 42.26,
    lng: -71.80,
    phone: '(508) 555-0444',
    website: 'https://example.org/wfsc',
    services: ['Case Management', 'Family Services'],
    languages: ['Spanish'],
    massHealth: 'Yes',
    medicare: 'No',
    commercial: 'No',
    undocumented: 'No', 
    telehealth: 'Unknown',
  }
];

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App render error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-white rounded-xl shadow-lg border-2 border-red-200 p-8 text-center">
            <h2 className="text-2xl font-bold text-red-700 mb-4">Oops, something went wrong.</h2>
            <p className="text-slate-600 mb-6">We encountered an error while rendering the application.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-6 bg-[#1E396C] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#152a50]"
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

const Icons = {
  Check: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  Cross: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  Help: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  MapPin: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Search: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Phone: () => <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  ExternalLink: () => <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>,
  Alert: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  Menu: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
};

const CrisisBanner = () => (
  <div className="bg-[#D9272E] text-white p-4">
    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-start sm:items-center gap-3">
        <div className="mt-1 sm:mt-0 text-white"><Icons.Alert /></div>
        <div>
          <p className="font-bold text-lg leading-tight">Need immediate help?</p>
          <p className="text-sm text-white/90">Call or text <strong className="text-xl">988</strong> for the Suicide & Crisis Lifeline (Available 24/7, English/Spanish).</p>
        </div>
      </div>
      <a href="tel:988" className="bg-white text-[#D9272E] px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors whitespace-nowrap shadow-sm">
        Call 988 Now
      </a>
    </div>
  </div>
);

const StatusIndicator = ({ status, label }) => {
  if (status === 'Yes') {
    return (
      <div className="flex items-center text-green-800 bg-green-50 px-2 py-1 rounded text-sm font-medium mb-1">
        <div className="mr-1"><Icons.Check /></div>
        {label}
      </div>
    );
  }
  if (status === 'No') {
    return (
      <div className="flex items-center text-gray-500 line-through px-2 py-1 text-sm mb-1">
        <div className="mr-1"><Icons.Cross /></div>
        {label}
      </div>
    );
  }
  return (
    <div className="flex items-start text-slate-700 bg-slate-100 p-2 rounded-md text-sm border border-slate-200 mb-1">
      <div className="mr-2 text-slate-500 mt-0.5 flex-shrink-0"><Icons.Help /></div>
      <span>
        Information regarding <strong>{label.toLowerCase()}</strong> is not publicly specified. Contact provider to confirm.
      </span>
    </div>
  );
};

const ResourceCard = ({ resource, isActive, onClick }) => {
  const services = resource.services || [];
  const languages = resource.languages || [];
  const safePhone = resource.phone || '';
  const phoneLink = `tel:${safePhone.replace(/[^0-9]/g, '')}`;

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm border-2 transition-all cursor-pointer hover:shadow-md h-full flex flex-col ${isActive ? 'border-[#1E396C] ring-2 ring-[#1E396C]/20' : 'border-gray-100 hover:border-[#1E396C]/40'}`}
    >
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-xl text-[#1E396C]">{resource.name || 'Unknown Name'}</h3>
        </div>
        
        <p className="text-slate-600 mb-4 flex items-center text-sm">
          <span className="mr-1 text-slate-400"><Icons.MapPin /></span>
          {resource.address}, {resource.city}, MA {resource.zip}
        </p>

        <div className="space-y-3 mb-5">
          {services.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {services.map(s => (
                <span key={s} className="bg-slate-100 text-[#1E396C] text-xs font-semibold px-2.5 py-1 rounded-full border border-slate-200">
                  {s}
                </span>
              ))}
            </div>
          )}
          
          {languages.length > 0 && (
            <div className="flex flex-wrap gap-2 text-sm text-slate-700">
              <span className="font-semibold mr-1">Languages:</span>
              {languages.join(' • ')}
            </div>
          )}
        </div>

        <div className="space-y-2 mb-6 mt-auto">
          <StatusIndicator status={resource.massHealth} label="Accepts MassHealth" />
          <StatusIndicator status={resource.undocumented} label="Serves people regardless of immigration status" />
          <StatusIndicator status={resource.telehealth} label="Telehealth available" />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
          <a href={phoneLink} onClick={(e) => e.stopPropagation()} className="flex items-center justify-center flex-1 bg-white border-2 border-[#1E396C] text-[#1E396C] px-4 py-2 rounded-lg font-bold hover:bg-slate-50 transition-colors">
            <Icons.Phone /> Call
          </a>
          {resource.website && (
            <a href={resource.website} onClick={(e) => e.stopPropagation()} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center flex-1 bg-[#1E396C] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#152a50] transition-colors shadow-sm">
              <Icons.ExternalLink /> Website
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ resetFilters }) => (
  <div className="bg-white border-2 border-slate-200 rounded-xl p-8 text-center flex flex-col items-center">
    <div className="text-[#1E396C] mb-4 bg-slate-100 p-3 rounded-full shadow-sm"><Icons.Search /></div>
    <h3 className="text-xl font-bold text-slate-900 mb-2">We couldn't find a match.</h3>
    <p className="text-slate-600 mb-6 max-w-md">
      This doesn't mean help isn't available. Try adjusting your filters to see more potential options.
    </p>
    
    <div className="flex flex-col gap-3 w-full max-w-xs">
      <button onClick={resetFilters} className="bg-[#1E396C] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#152a50] transition-colors shadow-sm">
        Clear All Filters
      </button>
    </div>
  </div>
);

const SimulatedMap = ({ resources, activeId, setActiveId }) => {
  const mapProps = { minLat: 41.5, maxLat: 43.0, minLng: -73.5, maxLng: -69.9 };
  
  const getPosition = (lat, lng) => {
    if (!lat || !lng) return { top: '-999px', left: '-999px' };
    const y = ((mapProps.maxLat - lat) / (mapProps.maxLat - mapProps.minLat)) * 100;
    const x = ((lng - mapProps.minLng) / (mapProps.maxLng - mapProps.minLng)) * 100;
    return { top: `${y}%`, left: `${x}%` };
  };

  return (
    <div className="relative w-full h-full bg-[#e5e9f0] rounded-xl overflow-hidden border border-slate-300 shadow-inner">
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1E396C 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
      
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-2 rounded-lg text-xs font-bold text-[#1E396C] shadow-sm uppercase tracking-wider border border-slate-200 z-20">
        Interactive Map View
      </div>
      <div className="hidden sm:block absolute bottom-4 right-4 bg-white/90 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 shadow-sm border border-slate-200 z-20 max-w-[300px] text-right">
        * The production version will use Mapbox to display real streets, boundaries, and geography.
      </div>
      
      {(resources || []).map(res => {
        const pos = getPosition(res.lat, res.lng);
        const isActive = activeId === res.id;
        return (
          <div 
            key={res.id} 
            className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer transition-all duration-300 z-10"
            style={pos}
            onClick={() => setActiveId(isActive ? null : res.id)}
          >
            <div className={`flex flex-col items-center ${isActive ? 'scale-125 z-50' : 'hover:scale-110 z-10'}`}>
              <div className={`p-1.5 rounded-t-full rounded-bl-full rotate-45 shadow-md border-2 border-white ${isActive ? 'bg-[#D9272E]' : 'bg-[#1E396C]'}`}>
                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
              </div>
              {isActive && (
                <div className="absolute top-full mt-1 bg-white text-xs font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap text-[#1E396C] border border-slate-200">
                  {res.name}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}

function MainApp() {
  const [activeId, setActiveId] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [search, setSearch] = useState('');
  const [filterLang, setFilterLang] = useState('');
  const [filterInsurance, setFilterInsurance] = useState('');
  const [filterUndocumented, setFilterUndocumented] = useState(false);

  const filteredResources = useMemo(() => {
    return mockData.filter(res => {
      const safeSearch = (search || '').toLowerCase();
      const safeName = (res.name || '').toLowerCase();
      const safeZip = (res.zip || '');
      if (search && !safeName.includes(safeSearch) && !safeZip.includes(search)) return false;
      
      if (filterLang && !(res.languages || []).includes(filterLang)) return false;
      
      if (filterInsurance) {
        if (filterInsurance === 'MassHealth' && res.massHealth === 'No') return false;
        if (filterInsurance === 'Medicare' && res.medicare === 'No') return false;
        if (filterInsurance === 'Commercial' && res.commercial === 'No') return false;
      }

      if (filterUndocumented && res.undocumented === 'No') return false;

      return true;
    });
  }, [search, filterLang, filterInsurance, filterUndocumented]);

  const resetFilters = () => {
    setSearch('');
    setFilterLang('');
    setFilterInsurance('');
    setFilterUndocumented(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <CrisisBanner />
      
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm flex-shrink-0">
        <div className="max-w-[1500px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex text-2xl font-black tracking-tight">
               <span className="text-[#D9272E]">MIRA</span>
               <span className="text-[#1E396C] ml-1">Coalition</span>
            </div>
            <div className="hidden sm:block border-l-2 border-slate-200 pl-3 ml-1">
              <h1 className="font-bold text-sm leading-tight text-slate-800">Mental Health<br/>Resource Navigator</h1>
            </div>
          </div>
          <button 
            className="md:hidden p-2 text-slate-600 bg-slate-100 rounded-md"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Icons.Menu />
          </button>
        </div>
      </header>

      <div className="max-w-[1500px] mx-auto w-full flex-1 flex flex-col md:flex-row md:h-[calc(100vh-140px)]"> 
        
        <aside className={`w-full md:w-80 flex-shrink-0 bg-white border-r border-slate-200 p-5 overflow-y-auto ${mobileMenuOpen ? 'block fixed inset-0 z-50 pt-20' : 'hidden md:block'}`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-lg text-[#1E396C]">Find Resources</h2>
            {mobileMenuOpen && (
              <button onClick={() => setMobileMenuOpen(false)} className="text-slate-500 bg-slate-100 p-1 rounded"><Icons.Cross /></button>
            )}
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#1E396C] mb-1.5">Search by Name or ZIP</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Icons.Search />
                </div>
                <input 
                  type="text" 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E396C] outline-none text-sm"
                  placeholder="e.g., 02118 or Boston"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1E396C] mb-1.5">Language Access</label>
              <select 
                value={filterLang} 
                onChange={e => setFilterLang(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E396C] outline-none text-sm appearance-none"
              >
                <option value="">Any Language</option>
                <option value="Spanish">Spanish</option>
                <option value="Portuguese">Portuguese</option>
                <option value="Haitian Creole">Haitian Creole</option>
                <option value="Vietnamese">Vietnamese</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1E396C] mb-1.5">Insurance Accepted</label>
              <select 
                value={filterInsurance} 
                onChange={e => setFilterInsurance(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E396C] outline-none text-sm appearance-none"
              >
                <option value="">Any Insurance</option>
                <option value="MassHealth">MassHealth</option>
                <option value="Medicare">Medicare</option>
                <option value="Commercial">Commercial / Private</option>
              </select>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={filterUndocumented} 
                  onChange={e => setFilterUndocumented(e.target.checked)} 
                  className="mt-1 w-4 h-4 text-[#1E396C] border-slate-300 rounded focus:ring-[#1E396C]" 
                />
                <span className="text-sm text-slate-700 font-medium group-hover:text-[#1E396C]">
                  Serves regardless of immigration status
                </span>
              </label>
            </div>

            {mobileMenuOpen && (
              <button onClick={() => setMobileMenuOpen(false)} className="w-full bg-[#1E396C] text-white py-3 rounded-lg font-bold mt-4">
                Show {filteredResources.length} Results
              </button>
            )}
          </div>
        </aside>

        <main className="flex-1 flex flex-col bg-slate-50 overflow-hidden relative">
          <div className="flex-1 overflow-y-auto">
            
            <div className="w-full h-[300px] md:h-[450px] p-4 md:p-6 flex-shrink-0">
               <SimulatedMap 
                  resources={filteredResources} 
                  activeId={activeId} 
                  setActiveId={setActiveId} 
               />
            </div>

            <div className="px-4 md:px-6 pb-12">
              <div className="mb-6 border-b border-slate-200 pb-3 flex justify-between items-end">
                <h2 className="font-bold text-2xl text-[#1E396C]">{filteredResources.length} Resources Found</h2>
              </div>
              
              {filteredResources.length === 0 ? (
                <div className="max-w-2xl mx-auto">
                  <EmptyState resetFilters={resetFilters} />
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredResources.map(res => (
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
    </div>
  );
}