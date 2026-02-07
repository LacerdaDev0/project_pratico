
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, Navigation, Filter, X, Car, Bike, Info, SlidersHorizontal, MapPin } from 'lucide-react';
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

  const [zoom, setZoom] = useState(1);
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

  const resetFilters = () => {
    setCategory('ALL');
    setMaxPrice(250);
    setMaxDistance(10);
  };

  return (
    <div 
      className="relative h-full w-full bg-[#f0f4f8] overflow-hidden select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Map Background with grid */}
      <div 
        className="absolute inset-0 transition-transform duration-75 ease-out"
        style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`, transformOrigin: 'center' }}
      >
        <div className="absolute inset-[-200%] bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:40px_40px] opacity-50"></div>
        
        {/* User Location Marker */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
          <div className="absolute inset-0 w-4 h-4 bg-blue-600 rounded-full animate-ping opacity-30"></div>
        </div>

        {filteredInstructors.map((inst) => (
          <button
            key={inst.id}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => setSelectedInstructor(inst)}
            style={{ top: `${inst.location.lat}%`, left: `${inst.location.lng}%` }}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${selectedInstructor?.id === inst.id ? 'scale-125 z-30' : 'scale-100 z-20'}`}
          >
            <div className={`p-1 rounded-full border-2 ${selectedInstructor?.id === inst.id ? 'bg-blue-600 border-white' : 'bg-white border-blue-600'} shadow-xl relative`}>
              <img src={inst.avatar} alt={inst.name} className="w-10 h-10 rounded-full object-cover" />
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm px-1.5 py-0.5 rounded-full shadow-md border border-gray-100 z-50">
                <span className="text-[9px] font-black text-blue-600 whitespace-nowrap">{inst.distance}km</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Top Search & Filter Bar */}
      <div className="absolute top-4 left-4 right-4 z-40">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-lg p-1.5 flex items-center border border-white/50">
          <div className="p-2 ml-1"><Search className="text-gray-400" size={20} /></div>
          <input 
            type="text" 
            placeholder="Onde vamos aprender hoje?" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 font-medium text-gray-700" 
          />
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`p-2.5 rounded-2xl transition-all mr-1 ${isFilterOpen ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
          >
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Filter Options Modal */}
      {isFilterOpen && (
        <div className="absolute top-[5.5rem] left-4 right-4 bg-white/95 backdrop-blur-lg rounded-[2.5rem] shadow-2xl p-6 border border-gray-100 z-40 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest flex items-center gap-2">
              <SlidersHorizontal size={16} /> Filtros
            </h3>
            <button onClick={resetFilters} className="text-[10px] font-black text-blue-600 uppercase hover:underline">Limpar</button>
          </div>

          <div className="space-y-6">
            {/* Category Filter */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Categoria da CNH</label>
              <div className="flex gap-2">
                {['ALL', 'A', 'B', 'AB'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat as any)}
                    className={`flex-1 py-3 rounded-2xl font-black text-xs transition-all ${category === cat ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                  >
                    {cat === 'ALL' ? 'Todas' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Valor Máximo</label>
                <span className="text-xs font-black text-blue-600">R$ {maxPrice}</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="300" 
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Distance Filter */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Raio de Distância</label>
                <span className="text-xs font-black text-blue-600">{maxDistance} km</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="20" 
                step="0.5"
                value={maxDistance}
                onChange={(e) => setMaxDistance(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>

          <button 
            onClick={() => setIsFilterOpen(false)}
            className="w-full bg-blue-600 text-white py-4 rounded-3xl font-black text-xs uppercase tracking-widest mt-8 shadow-xl shadow-blue-100 active:scale-95 transition-all"
          >
            Aplicar Filtros
          </button>
        </div>
      )}

      {/* Selected Instructor Card */}
      {selectedInstructor && (
        <div className="absolute bottom-6 left-6 right-6 bg-white rounded-[2.5rem] shadow-2xl p-6 animate-in slide-in-from-bottom-12 duration-500 z-40 border border-gray-100">
          <div className="flex items-start justify-between mb-6">
            <div 
              className="flex gap-4 cursor-pointer group"
              onClick={() => onViewProfile(selectedInstructor.id)}
            >
              <div className="relative">
                <img src={selectedInstructor.avatar} alt={selectedInstructor.name} className="w-16 h-16 rounded-[1.25rem] object-cover shadow-md group-hover:opacity-80 transition-opacity" />
                <div className="absolute -top-2 -left-2 bg-blue-600 text-white w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black border-2 border-white">
                  {selectedInstructor.licenseType}
                </div>
              </div>
              <div>
                <h3 className="font-black text-xl text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">{selectedInstructor.name}</h3>
                <p className="text-gray-500 text-xs mt-1 font-medium flex items-center gap-1">
                   <MapPin size={12} className="text-blue-500" /> {selectedInstructor.distance} km de você
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-yellow-400 font-bold text-xs">{selectedInstructor.rating} ★</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-blue-600 font-black text-xs">R$ {selectedInstructor.price}/aula</span>
                </div>
              </div>
            </div>
            <button onClick={() => setSelectedInstructor(null)} className="p-2 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
              <X size={18} className="text-gray-400" />
            </button>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => onBook(selectedInstructor.id, selectedInstructor.name, selectedInstructor.avatar)}
              className="flex-[2] bg-blue-600 text-white py-4 rounded-3xl font-black shadow-lg active:scale-95 transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2"
            >
              Solicitar Aula
            </button>
            <button 
              onClick={() => onViewProfile(selectedInstructor.id)}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-4 rounded-3xl font-black active:scale-95 transition-all text-xs uppercase tracking-widest"
            >
              Perfil
            </button>
          </div>
        </div>
      )}

      {/* Current Location Button */}
      <button 
        className="absolute right-6 bottom-32 bg-white p-4 rounded-2xl shadow-xl border border-gray-50 text-blue-600 hover:text-blue-700 active:scale-90 transition-all z-30"
        onClick={() => {
          setOffset({ x: 0, y: 0 });
          setZoom(1);
        }}
      >
        <Navigation size={24} fill="currentColor" />
      </button>
    </div>
  );
};

export default MapView;
