
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, Navigation, Filter, X, Plus, Minus, MapPin, SlidersHorizontal, Star, Map as MapIcon, List, Zap, Car, Bike, Layers, RotateCcw } from 'lucide-react';
import { Instructor, LicenseType, MOCK_INSTRUCTORS } from '../types';
import BookingModal from './BookingModal';

interface MapViewProps {
  onBook: (id: string, name: string, avatar: string, details?: any) => void;
  onViewProfile: (id: string) => void;
}

const MapView: React.FC<MapViewProps> = ({ onBook, onViewProfile }) => {
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  
  // Filter States
  const [category, setCategory] = useState<LicenseType | 'ALL'>('ALL');
  const [maxPrice, setMaxPrice] = useState<number>(300);
  const [maxDistance, setMaxDistance] = useState<number>(15);

  const [zoom, setZoom] = useState(1.2);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const filteredInstructors = useMemo(() => {
    return MOCK_INSTRUCTORS.filter(inst => {
      const matchesCategory = category === 'ALL' || inst.licenseType === category || (category === 'AB' && (inst.licenseType === 'A' || inst.licenseType === 'B'));
      const matchesPrice = inst.price <= maxPrice;
      const matchesDistance = inst.distance <= maxDistance;
      const matchesSearch = inst.name.toLowerCase().includes(searchQuery.toLowerCase()) || inst.specialty.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesPrice && matchesDistance && matchesSearch;
    }).sort((a, b) => a.distance - b.distance);
  }, [category, maxPrice, maxDistance, searchQuery]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (viewMode === 'list') return;
    setIsDragging(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || viewMode === 'list') return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    if (viewMode === 'list') return;
    const scaleFactor = 0.15;
    const direction = e.deltaY > 0 ? -1 : 1;
    const newZoom = Math.min(Math.max(zoom + direction * scaleFactor, 0.4), 4);
    setZoom(newZoom);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.3, 4));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.3, 0.4));

  const handleCenter = () => {
    setOffset({ x: 0, y: 0 });
    setZoom(1.2);
  };

  const resetFilters = () => {
    setCategory('ALL');
    setMaxPrice(300);
    setMaxDistance(15);
  };

  const handleBookingConfirm = (details: any) => {
    setIsBookingModalOpen(false);
    setSelectedInstructor(null);
    onBook(details.instructorId, selectedInstructor?.name || '', selectedInstructor?.avatar || '', details);
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
        className={`absolute inset-0 transition-all duration-500 ease-out cursor-grab active:cursor-grabbing ${viewMode === 'list' ? 'opacity-30 blur-[4px] scale-110' : 'opacity-100 blur-0 scale-100'}`}
        style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`, transformOrigin: 'center' }}
      >
        <div className="absolute inset-[-300%] opacity-20 dark:opacity-10 pointer-events-none">
          <div className="w-full h-full bg-[linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        </div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-7 h-7 bg-blue-600 rounded-full border-4 border-white dark:border-slate-900 shadow-[0_0_25px_rgba(37,99,235,0.6)] animate-pulse"></div>
          <div className="absolute inset-0 w-7 h-7 bg-blue-600 rounded-full animate-ping opacity-25"></div>
        </div>

        {filteredInstructors.map((inst) => (
          <button
            key={inst.id}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => setSelectedInstructor(inst)}
            style={{ top: `${inst.location.lat}%`, left: `${inst.location.lng}%` }}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${selectedInstructor?.id === inst.id ? 'scale-[1.4] z-40' : 'scale-100 z-30 hover:scale-110'}`}
          >
            <div className="flex flex-col items-center">
              <div className={`p-1 rounded-full border-2 ${selectedInstructor?.id === inst.id ? 'bg-blue-600 border-white' : 'bg-white dark:bg-slate-800 border-blue-600'} shadow-2xl transition-colors`}>
                <img src={inst.avatar} alt={inst.name} className="w-10 h-10 rounded-full object-cover" />
              </div>
              <div className="mt-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2 py-0.5 rounded-full shadow-lg border border-gray-100 dark:border-slate-800">
                <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 whitespace-nowrap">{inst.distance}km</span>
              </div>
              <div className={`w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] ${selectedInstructor?.id === inst.id ? 'border-t-blue-600' : 'border-t-white dark:border-t-slate-800'} -mt-0.5 shadow-sm`}></div>
            </div>
          </button>
        ))}
      </div>

      {/* Zoom Controls Overlay */}
      <div className={`absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 transition-all duration-500 ${viewMode === 'list' ? 'opacity-0 pointer-events-none translate-x-10' : 'opacity-100'}`}>
        <button 
          onClick={handleZoomIn}
          className="p-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] text-blue-600 dark:text-blue-400 active:scale-90 transition-all border border-white/50 dark:border-slate-800"
        >
          <Plus size={22} strokeWidth={3} />
        </button>
        <button 
          onClick={handleZoomOut}
          className="p-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] text-slate-500 dark:text-slate-400 active:scale-90 transition-all border border-white/50 dark:border-slate-800"
        >
          <Minus size={22} strokeWidth={3} />
        </button>
      </div>

      {/* List Content Overlay */}
      {viewMode === 'list' && (
        <div className="absolute inset-0 overflow-y-auto hide-scrollbar pt-44 px-6 pb-24 space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-500 z-[40]">
          {filteredInstructors.length > 0 ? (
            filteredInstructors.map((inst) => (
              <div key={inst.id} className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-[2rem] p-4 shadow-2xl border border-white/50 dark:border-slate-800/50 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex gap-4 cursor-pointer group items-center" onClick={() => onViewProfile(inst.id)}>
                    <div className="relative flex-shrink-0">
                      <img src={inst.avatar} alt={inst.name} className="w-14 h-14 rounded-2xl object-cover shadow-md group-hover:opacity-90 transition-opacity" />
                      <div className="absolute -top-1.5 -left-1.5 bg-blue-600 text-white w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black border-2 border-white dark:border-slate-950 shadow-sm">
                        {inst.licenseType}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-base text-gray-900 dark:text-white tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                          {inst.name}
                        </h3>
                        <div className="flex items-center text-yellow-400 text-[10px]">
                          <Star size={10} fill="currentColor" />
                          <span className="ml-0.5 font-bold">{inst.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest mt-0.5 flex items-center gap-1">
                         <Navigation size={8} className="text-blue-500" fill="currentColor" /> {inst.distance} km de distância
                      </p>
                      <p className="text-blue-600 dark:text-blue-400 font-black text-xs mt-0.5">R$ {inst.price}/aula</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setSelectedInstructor(inst); setIsBookingModalOpen(true); }}
                    className="flex-[1.5] bg-blue-600 text-white py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-100 dark:shadow-none active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  >
                    Agendar Aula
                  </button>
                  <button 
                    onClick={() => onViewProfile(inst.id)}
                    className="flex-1 bg-white/50 dark:bg-slate-800/50 text-gray-600 dark:text-gray-300 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-gray-100 dark:border-slate-700 active:scale-95 transition-all"
                  >
                    Perfil
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 opacity-30">
               <MapIcon size={48} className="text-slate-400 mb-4" />
               <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Nenhum instrutor encontrado</p>
            </div>
          )}
        </div>
      )}

      {/* Header UI */}
      <div className="absolute top-4 left-4 right-4 z-[50] flex flex-col gap-3">
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl shadow-2xl p-1.5 flex items-center border border-white/50 dark:border-slate-800">
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

        <div className="flex justify-center gap-4">
          <button 
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 px-6 py-2 rounded-2xl transition-all border ${
              viewMode === 'map' 
                ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-200 dark:shadow-none' 
                : 'bg-white/90 dark:bg-slate-900/90 text-slate-400 border-white/50 dark:border-slate-800 dark:text-slate-500 shadow-lg'
            }`}
          >
            <MapIcon size={14} strokeWidth={viewMode === 'map' ? 3 : 2} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Mapa</span>
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-6 py-2 rounded-2xl transition-all border ${
              viewMode === 'list' 
                ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-200 dark:shadow-none' 
                : 'bg-white/90 dark:bg-slate-900/90 text-slate-400 border-white/50 dark:border-slate-800 dark:text-slate-500 shadow-lg'
            }`}
          >
            <List size={14} strokeWidth={viewMode === 'list' ? 3 : 2} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Lista</span>
          </button>
        </div>
      </div>

      {/* Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-[3rem] sm:rounded-[3rem] p-8 shadow-2xl animate-in slide-in-from-bottom-full duration-500">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Filtros</h3>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Personalize sua busca</p>
              </div>
              <button onClick={() => setIsFilterOpen(false)} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 hover:rotate-90 transition-transform">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-8">
              {/* Category Filter */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoria de Habilitação</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'ALL', label: 'Todos', icon: Layers },
                    { id: 'A', label: 'Moto', icon: Bike },
                    { id: 'B', label: 'Carro', icon: Car },
                    { id: 'AB', label: 'Ambos', icon: Layers }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id as any)}
                      className={`flex flex-col items-center gap-2 py-3 rounded-2xl transition-all border ${
                        category === cat.id 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' 
                          : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-400 hover:border-blue-100'
                      }`}
                    >
                      <cat.icon size={18} />
                      <span className="text-[9px] font-black uppercase tracking-tight">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Preço Máximo (R$)</label>
                  <span className="text-sm font-black text-blue-600">Até R$ {maxPrice}</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="300" 
                  step="10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-300">
                  <span>R$ 50</span>
                  <span>R$ 300</span>
                </div>
              </div>

              {/* Distance Filter */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Distância Máxima (km)</label>
                  <span className="text-sm font-black text-blue-600">Até {maxDistance} km</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="30" 
                  step="1"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-300">
                  <span>1 km</span>
                  <span>30 km</span>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={resetFilters}
                  className="flex-1 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-500 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-100 transition-all"
                >
                  <RotateCcw size={14} /> Limpar
                </button>
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="flex-[2] py-4 rounded-2xl bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-100 active:scale-95 transition-all"
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Instructor Card */}
      {viewMode === 'map' && selectedInstructor && (
        <div className="absolute bottom-6 left-6 right-6 bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] p-4 animate-in slide-in-from-bottom-12 duration-500 z-[60] border border-gray-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-4 cursor-pointer group items-center" onClick={() => onViewProfile(selectedInstructor.id)}>
              <div className="relative">
                <img src={selectedInstructor.avatar} alt={selectedInstructor.name} className="w-14 h-14 rounded-2xl object-cover shadow-md group-hover:opacity-80 transition-opacity" />
                <div className="absolute -top-1.5 -left-1.5 bg-blue-600 text-white w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black border-2 border-white dark:border-slate-900 shadow-sm">
                  {selectedInstructor.licenseType}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-base text-gray-900 dark:text-white tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                    {selectedInstructor.name}
                  </h3>
                  <div className="flex items-center text-yellow-400 text-[10px]">
                    <Star size={10} fill="currentColor" />
                    <span className="ml-0.5 font-bold">{selectedInstructor.rating}</span>
                  </div>
                </div>
                <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest mt-0.5 flex items-center gap-1">
                   <Navigation size={8} className="text-blue-500" fill="currentColor" /> {selectedInstructor.distance} km de distância
                </p>
                <p className="text-blue-600 dark:text-blue-400 font-black text-xs mt-0.5">R$ {selectedInstructor.price}/aula</p>
              </div>
            </div>
            <button onClick={() => setSelectedInstructor(null)} className="p-2 bg-gray-50 dark:bg-slate-800 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
              <X size={16} className="text-gray-400" />
            </button>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsBookingModalOpen(true)}
              className="flex-[1.5] bg-blue-600 text-white py-2.5 rounded-2xl font-black shadow-lg shadow-blue-50 active:scale-95 transition-all text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5"
            >
              Agendar Aula
            </button>
            <button 
              onClick={() => onViewProfile(selectedInstructor.id)}
              className="flex-1 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-2xl font-black active:scale-95 transition-all text-[10px] uppercase tracking-widest border border-gray-200/50 dark:border-slate-700"
            >
              Ver Perfil
            </button>
          </div>
        </div>
      )}

      {/* Booking Modal Overlay */}
      {isBookingModalOpen && selectedInstructor && (
        <BookingModal 
          instructor={selectedInstructor}
          onClose={() => setIsBookingModalOpen(false)}
          onConfirm={handleBookingConfirm}
        />
      )}

      {/* Re-center Button */}
      {viewMode === 'map' && (
        <button 
          className="absolute right-6 bottom-32 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-2xl border border-gray-50 dark:border-slate-800 text-blue-600 dark:text-blue-400 hover:text-blue-700 active:scale-90 transition-all z-40"
          onClick={handleCenter}
        >
          <Navigation size={24} fill="currentColor" className="rotate-45" />
        </button>
      )}
    </div>
  );
};

export default MapView;
