"use client";

import React, { useState, Component, ReactNode } from 'react';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('./Map'), {
ssr: false,
loading: () => Loading Map...
});

interface Resource {
id: string; name: string; address: string; lat: number; lng: number;
phone?: string; website?: string;
services: string[]; languages: string[]; massHealth: string;
medicare: string; commercial: string; undocumented: string; telehealth: string;
notes?: string;
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
if (this.state.hasError) return Something went wrong. Please refresh.;
return this.props.children;
}
}

const Icons = {
MapPin: () => ,
Phone: () => ,
Globe: () => ,
Close: () => ,
Info: () => ,
Shield: () => ,
List: () => ,
Chat: () => ,
Check: () => ,
Cross: () => ,
Help: () => ,
};

export default function DirectoryClient({ initialData }: { initialData: Resource[] }) {
const [activeId, setActiveId] = useState<string | null>(null);
const [language, setLanguage] = useState('');
const [insurance, setInsurance] = useState('');
const [zipInput, setZipInput] = useState('');
const [radius, setRadius] = useState('5');
const [searchCenter, setSearchCenter] = useState<[number, number]>([42.3601, -71.0589]);
const [isSearching, setIsSearching] = useState(false);

const handleZipSearch = async () => {
if (!zipInput || zipInput.length < 5) return;
setIsSearching(true);
try {
const res = await fetch(https://nominatim.openstreetmap.org/search?postalcode=${zipInput}&country=US&format=json);
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

const filteredData = initialData.filter(res => {
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

const activeResource = initialData.find(r => r.id === activeId);

const DataRow = ({ icon: Icon, title, content, isLink = false, linkHref = "" }: any) => {
const isMissing = !content || content === "Unknown" || content.length === 0;

return (
  <div className="flex items-start py-3 border-b border-slate-100 last:border-0">
    <div className="flex items-center w-40 flex-shrink-0 pt-0.5">
      <Icon />
      <span className="text-sm font-medium text-slate-600">{title}</span>
    </div>
    <div className="flex-1">
      {isMissing ? (
        <span className="text-sm text-slate-400 italic">Not specified</span>
      ) : isLink ? (
        <a href={linkHref} target="_blank" rel="noopener noreferrer" className="text-sm text-[#4eb5b1] hover:underline hover:text-[#0f284e] break-all">
          {content}
        </a>
      ) : Array.isArray(content) ? (
        <div className="flex flex-wrap gap-2">
          {content.map((item, i) => (
            <span key={i} className={`px-2.5 py-1 text-xs font-semibold rounded ${title === 'Languages' ? 'bg-[#0f284e]/10 text-[#0f284e]' : 'bg-[#4eb5b1]/15 text-[#0f284e]'}`}>
              {item.trim()}
            </span>
          ))}
        </div>
      ) : (
        <span className="text-sm text-slate-800">{content}</span>
      )}
    </div>
  </div>
);


};

return (



    {/* NEW HEADER WITH MIRA LOGO */}
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          {/* MIRA Logo image from the public folder */}
          <img 
            src="/mira-logo.png" 
            alt="MIRA Coalition Logo" 
            className="h-10 sm:h-12 w-auto object-contain"
          />
          {/* App Title Separator */}
          <div className="border-l-2 border-slate-200 pl-4 ml-4 hidden sm:block">
            <h1 className="font-extrabold text-lg text-[#0f284e] leading-tight tracking-tight">Mental Health</h1>
            <p className="text-[10px] text-[#d8272f] font-bold tracking-widest uppercase">Resource Network</p>
          </div>
        </div>
      </div>
    </header>

    <div className="bg-white border-b border-slate-200 py-10 px-4 mb-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f284e] mb-6 tracking-tight">
          Mental Health Resources Directory
        </h2>
        <p className="text-lg text-slate-700 mb-8 leading-relaxed max-w-3xl">
          Explore a growing network of community based organizations working to uplift, empower, and serve our communities. Whether you're looking for support, partnerships, or ways to get involved, this directory connects you to trusted resources making a local impact.
        </p>
        
        <div className="bg-slate-50 rounded-xl p-6 text-sm text-slate-600 space-y-4 border border-slate-200 shadow-sm">
          <p>
            <strong>Disclaimer:</strong> This Directory is offered solely for informational purposes. While the MIRA Coalition strives to ensure the accuracy and currency of the information presented, inclusion in this Directory does not constitute an endorsement or recommendation of any individual, organization, or service.
          </p>
          <p>
            Users are responsible for independently verifying any details related to listed providers, including credentials, qualifications, areas of expertise, and availability. The MIRA Coalition assumes no responsibility or liability for any decisions made or outcomes experienced based on the use of this Directory.
          </p>
          <p className="font-bold text-[#d8272f] text-base pt-2 border-t border-slate-200">
            If you are experiencing a mental health crisis, please call 911 or visit your nearest emergency room. You may also call or text 988 to reach the Suicide and Crisis Lifeline, which is available 24/7.
          </p>
        </div>
      </div>
    </div>

    <main className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-8">
      <aside className="w-full lg:w-72 flex-shrink-0 space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-24">
          <h2 className="font-bold text-lg text-[#0f284e] mb-4">Filter Resources</h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-slate-700">Location / ZIP Code</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="e.g. 02118" 
                  maxLength={5}
                  value={zipInput}
                  onChange={(e) => setZipInput(e.target.value.replace(/\D/g, ''))}
                  className="w-2/3 border-slate-300 rounded-md p-2 bg-slate-50 border focus:ring-2 focus:ring-[#0f284e]"
                />
                <select 
                  value={radius} 
                  onChange={(e) => setRadius(e.target.value)}
                  className="w-1/3 border-slate-300 rounded-md p-2 bg-slate-50 border focus:ring-2 focus:ring-[#0f284e] text-sm"
                >
                  <option value="5">5 mi</option>
                  <option value="10">10 mi</option>
                  <option value="25">25 mi</option>
                </select>
              </div>
              <button 
                onClick={handleZipSearch}
                disabled={zipInput.length < 5 || isSearching}
                className="w-full mt-2 bg-[#0f284e] hover:bg-[#1a3f78] transition-colors text-white text-sm font-semibold py-2 rounded-md disabled:opacity-50"
              >
                {isSearching ? 'Locating...' : 'Search Radius'}
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <label className="block text-sm font-semibold mb-1.5 text-slate-700">Language Supported</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full border-slate-300 rounded-md p-2 bg-slate-50 border focus:ring-2 focus:ring-[#0f284e]">
                <option value="">Any Language</option>
                <option value="Spanish">Spanish</option>
                <option value="Portuguese">Portuguese</option>
                <option value="Haitian Creole">Haitian Creole</option>
                <option value="Vietnamese">Vietnamese</option>
                <option value="Cambodian">Cambodian / Khmer</option>
              </select>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <label className="block text-sm font-semibold mb-1.5 text-slate-700">Insurance Accepted</label>
              <select value={insurance} onChange={(e) => setInsurance(e.target.value)} className="w-full border-slate-300 rounded-md p-2 bg-slate-50 border focus:ring-2 focus:ring-[#0f284e]">
                <option value="">Any Insurance</option>
                <option value="MassHealth">MassHealth</option>
                <option value="Medicare">Medicare</option>
                <option value="Commercial">Commercial / Private</option>
              </select>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col gap-8">
        <MapComponent resources={filteredData} activeId={activeId} setActiveId={setActiveId} center={searchCenter} />
        
        <div>
          <div className="flex justify-between items-end mb-4 px-1">
            <h2 className="font-bold text-2xl text-[#0f284e]">Directory ({filteredData.length})</h2>
          </div>
          
          {filteredData.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
              <h3 className="text-xl font-bold text-[#0f284e] mb-2">No matching resources found</h3>
              <button onClick={() => { setLanguage(''); setInsurance(''); setZipInput(''); }} className="bg-[#0f284e] text-white px-6 py-2 rounded-md font-medium mt-4">Clear Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredData.slice(0, 200).map(res => (
                <div 
                  key={res.id} 
                  onClick={() => setActiveId(res.id)}
                  className="bg-white rounded-xl border border-slate-200 p-5 hover:border-[#4eb5b1] hover:shadow-md cursor-pointer transition-all flex flex-col h-full group"
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-[#0f284e] text-[17px] leading-tight mb-3 group-hover:text-[#4eb5b1] transition-colors">{res.name}</h3>
                    <p className="text-slate-600 flex items-start text-sm">
                      <span className="mt-0.5 mr-2 text-slate-400"><Icons.MapPin /></span>
                      <span className="leading-snug">{res.address.split(',')[0]}</span> 
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-sm font-semibold text-[#0f284e] group-hover:text-[#4eb5b1]">
                    <span>View Details</span>
                    <span className="text-lg leading-none transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>

    {activeId && activeResource && (
      <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 opacity-100 transition-opacity">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden relative">
          
          <div className="px-8 py-6 flex justify-between items-start z-10 border-b border-slate-100">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0f284e] pr-8 leading-tight">{activeResource.name}</h2>
            <button onClick={() => setActiveId(null)} className="text-slate-400 hover:text-[#d8272f] bg-slate-50 hover:bg-red-50 rounded-full p-2 transition-colors">
              <Icons.Close />
            </button>
          </div>
          
          <div className="p-8 overflow-y-auto">
            <div className="flex flex-col gap-1 w-full max-w-2xl">
              
              <DataRow icon={Icons.MapPin} title="Location" content={activeResource.address} isLink={true} linkHref={`https://maps.google.com/?q=${encodeURIComponent(activeResource.address)}`} />
              <DataRow icon={Icons.Phone} title="Phone" content={activeResource.phone} isLink={true} linkHref={`tel:${activeResource.phone}`} />
              <DataRow icon={Icons.Globe} title="Website" content={activeResource.website} isLink={true} linkHref={activeResource.website} />
              
              <DataRow icon={Icons.Chat} title="Languages" content={activeResource.languages} />
              <DataRow icon={Icons.List} title="Services" content={activeResource.services} />
              
              <DataRow 
                icon={Icons.Shield} 
                title="Insurance & Access" 
                content={[
                  ...(activeResource.massHealth.toLowerCase().includes('y') ? ['MassHealth'] : []),
                  ...(activeResource.medicare.toLowerCase().includes('y') ? ['Medicare'] : []),
                  ...(activeResource.commercial.toLowerCase().includes('y') ? ['Commercial Insurance'] : []),
                  ...(activeResource.undocumented.toLowerCase().includes('y') ? ['Serves Undocumented Individuals'] : []),
                  ...(activeResource.telehealth.toLowerCase().includes('y') ? ['Telehealth Available'] : [])
                ]} 
              />

              {activeResource.notes && (
                <div className="flex items-start py-4 border-b border-slate-100">
                  <div className="flex items-center w-40 flex-shrink-0 pt-0.5">
                    <Icons.Info />
                    <span className="text-sm font-medium text-slate-600">More Information</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                      {activeResource.notes}
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
        
        <div className="absolute inset-0 z-[-1]" onClick={() => setActiveId(null)}></div>
      </div>
    )}
  </div>
</ErrorBoundary>


);
}