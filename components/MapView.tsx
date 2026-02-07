
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, Navigation, Filter, X, Plus, Minus, MapPin, SlidersHorizontal, Star } from 'lucide-react';
import { Instructor, LicenseType, MOCK_INSTRUCTORS } from '../types';

interface MapViewProps {
  onBook: (id: string, name: string, avatar: string) => void;
  onViewProfile: (id: string) => void;
}

const MapView: React.FC<MapViewProps> = ({ onBook, onViewProfile }) => {
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter States
  const [category, setCategory] = useState<LicenseType | 'ALL'>('ALL');
  const [maxPrice, setMaxPrice] = useState<number>(250);
  const [maxDistance, setMaxDistance] = useState<number>(10);

  const [zoom, setZoom] = useState(1.2);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const filteredInstructors = useMemo(() => {
    return MOCK_INSTRUCTORS.filter(inst => {
      const matchesCategory = category === 'ALL' || inst.licenseType === category || (category === 'AB' && (inst.licenseType === 'A' || inst.licenseType === 'B' || inst.licenseType === 'AB'));
      const matchesPrice = inst.price <= maxPrice;
      const matchesDistance = inst.distance <= maxDistance;
      const matchesSearch = inst.name.toLowerCase().includes(searchQuery.toLowerCase()) || inst.specialty.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesPrice && matchesDistance && matchesSearch;
    });
  }, [category, maxPrice, maxDistance, searchQuery]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    const scaleFactor = 0.1;
    const direction = e.deltaY > 0 ? -1 : 1;
    const newZoom = Math.min(Math.max(zoom + direction * scaleFactor, 0.5), 3);
    setZoom(newZoom);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));

  const handleCenter = () => {
    setOffset({ x: 0, y: 0 });
    setZoom(1.2);
  };

  const resetFilters = () => {
    setCategory('ALL');
    setMaxPrice(250);
    setMaxDistance(10);
  };

  return (
    <div 
      className="relative h-full w-full bg-[#e5e9f0] dark:bg-[#0f172a] overflow-hidden select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Map Content Layer */}
      <div 
        className="absolute inset-0 transition-transform duration-150 ease-out cursor-grab active:cursor-grabbing"
        style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`, transformOrigin: 'center' }}
      >
        {/* Abstract Urban Background */}
        <div className="absolute inset-[-300%] opacity-20 dark:opacity-10 pointer-events-none">
          {/* Street Grid */}
          <div className="w-full h-full bg-[linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
          {/* Finer details */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
          {/* Parks and Blocks */}
          <div className="absolute top-[20%] left-[30%] w-[150px] h-[200px] bg-green-100 dark:bg-green-900/20 rounded-lg"></div>
          <div className="absolute top-[60%] left-[10%] w-[300px] h-[150px] bg-blue-100 dark:bg-blue-900/20 rounded-lg"></div>
          <div className="absolute top-[40%] left-[70%] w-[200px] h-[300px] bg-gray-200 dark:bg-gray-800/30 rounded-lg"></div>
        </div>
        
        {/* User Location Marker (Central) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-6 h-6 bg-blue-600 rounded-full border-4 border-white dark:border-slate-900 shadow-[0_0_15px_rgba(37,99,235,0.5)] animate-pulse"></div>
          <div className="absolute inset-0 w-6 h-6 bg-blue-600 rounded-full animate-ping opacity-20"></div>
        </div>

        {/* Instructor Pins */}
        {filteredInstructors.map((inst) => (
          <button
            key={inst.id}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => setSelectedInstructor(inst)}
            style={{ top: `${inst.location.lat}%`, left: `${inst.location.lng}%` }}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${selectedInstructor?.id === inst.id ? 'scale-125 z-40' : 'scale-100 z-30'}`}
          >
            <div className="flex flex-col items-center">
              <div className={`p-1 rounded-full border-2 ${selectedInstructor?.id === inst.id ? 'bg-blue-600 border-white' : 'bg-white dark:bg-slate-800 border-blue-600'} shadow-2xl transition-colors`}>
                <img src={inst.avatar} alt={inst.name} className="w-10 h-10 rounded-full object-cover" />
              </div>
              <div className="mt-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2 py-0.5 rounded-full shadow-lg border border-gray-100 dark:border-slate-800">
                <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 whitespace-nowrap">{inst.distance}km</span>
              </div>
              {/* Pointer */}
              <div className={`w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] ${selectedInstructor?.id === inst.id ? 'border-t-blue-600' : 'border-t-white dark:border-t-slate-800'} -mt-0.5 shadow-sm`}></div>
            </div>
          </button>
        ))}
      </div>

      {/* Floating UI Elements */}
      <div className="absolute top-4 left-4 right-4 z-[50] flex flex-col gap-4">
        {/* Search Bar */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl shadow-2xl p-1.5 flex items-center border border-white/50 dark:border-slate-800">
          <div className="p-2 ml-1 text-gray-400"><Search size={20} /></div>
          <input 
            type="text" 
            placeholder="Onde vamos aprender hoje?" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 font-bold text-gray-700 dark:text-gray-200 placeholder:text-gray-400" 
          />
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`p-2.5 rounded-2xl transition-all mr-1 ${isFilterOpen ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-gray-50 dark:bg-slate-800 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
          >
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Zoom Controls Overlay */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-[50]">
        <button 
          onClick={handleZoomIn}
          className="p-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-xl text-gray-600 dark:text-gray-300 active:scale-90 transition-all border border-white/50 dark:border-slate-800"
        >
          <Plus size={20} strokeWidth={3} />
        </button>
        <button 
          onClick={handleZoomOut}
          className="p-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-xl text-gray-600 dark:text-gray-300 active:scale-90 transition-all border border-white/50 dark:border-slate-800"
        >
          <Minus size={20} strokeWidth={3} />
        </button>
      </div>

      {/* Filter Options Modal */}
      {isFilterOpen && (
        <div className="absolute top-20 left-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] p-6 border border-gray-100 dark:border-slate-800 z-[60] animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-gray-900 dark:text-white text-sm uppercase tracking-widest flex items-center gap-2">
              <SlidersHorizontal size={16} /> Filtros de Busca
            </h3>
            <button onClick={resetFilters} className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase hover:underline">Limpar</button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Categoria</label>
              <div className="flex gap-2">
                {['ALL', 'A', 'B', 'AB'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat as any)}
                    className={`flex-1 py-3 rounded-2xl font-black text-xs transition-all ${category === cat ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                  >
                    {cat === 'ALL' ? 'Todas' : cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Preço Máximo</label>
                <span className="text-xs font-black text-blue-600 dark:text-blue-400">R$ {maxPrice}</span>
              </div>
              <input 
                type="range" min="50" max="300" step="10" value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>

          <button 
            onClick={() => setIsFilterOpen(false)}
            className="w-full bg-blue-600 text-white py-4 rounded-3xl font-black text-xs uppercase tracking-widest mt-8 shadow-xl shadow-blue-200 active:scale-95 transition-all"
          >
            Ver Resultados
          </button>
        </div>
      )}

      {/* Selected Instructor Card */}
      {selectedInstructor && (
        <div className="absolute bottom-6 left-6 right-6 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] p-6 animate-in slide-in-from-bottom-12 duration-500 z-[60] border border-gray-100 dark:border-slate-800">
          <div className="flex items-start justify-between mb-6">
            <div 
              className="flex gap-4 cursor-pointer group"
              onClick={() => onViewProfile(selectedInstructor.id)}
            >
              <div className="relative">
                <img src={selectedInstructor.avatar} alt={selectedInstructor.name} className="w-16 h-16 rounded-3xl object-cover shadow-lg group-hover:opacity-80 transition-opacity" />
                <div className="absolute -top-2 -left-2 bg-blue-600 text-white w-7 h-7 rounded-xl flex items-center justify-center text-[11px] font-black border-2 border-white dark:border-slate-900 shadow-md">
                  {selectedInstructor.licenseType}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-xl text-gray-900 dark:text-white tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                    {selectedInstructor.name}
                  </h3>
                  <div className="flex items-center text-yellow-400 text-xs">
                    <Star size={12} fill="currentColor" />
                    <span className="ml-0.5 font-bold">{selectedInstructor.rating}</span>
                  </div>
                </div>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1 flex items-center gap-1">
                   <Navigation size={10} className="text-blue-500" fill="currentColor" /> {selectedInstructor.distance} km de distância
                </p>
                <p className="text-blue-600 dark:text-blue-400 font-black text-sm mt-1">R$ {selectedInstructor.price}/aula</p>
              </div>
            </div>
            <button onClick={() => setSelectedInstructor(null)} className="p-2.5 bg-gray-50 dark:bg-slate-800 rounded-2xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
              <X size={18} className="text-gray-400" />
            </button>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => onBook(selectedInstructor.id, selectedInstructor.name, selectedInstructor.avatar)}
              className="flex-[2] bg-blue-600 text-white py-4 rounded-3xl font-black shadow-xl shadow-blue-200 active:scale-95 transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2"
            >
              Agendar Aula
            </button>
            <button 
              onClick={() => onViewProfile(selectedInstructor.id)}
              className="flex-1 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 px-4 py-4 rounded-3xl font-black active:scale-95 transition-all text-xs uppercase tracking-widest border border-gray-200/50 dark:border-slate-700"
            >
              Ver Perfil
            </button>
          </div>
        </div>
      )}

      {/* Re-center Button */}
      <button 
        className="absolute right-6 bottom-32 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-2xl border border-gray-50 dark:border-slate-800 text-blue-600 dark:text-blue-400 hover:text-blue-700 active:scale-90 transition-all z-40"
        onClick={handleCenter}
      >
        <Navigation size={24} fill="currentColor" className="rotate-45" />
      </button>
    </div>
  );
};

export default MapView;
