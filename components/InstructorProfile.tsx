
import React, { useState } from 'react';
import { ArrowLeft, MessageSquare, Star, Award, MapPin, Clock, Calendar, ChevronRight } from 'lucide-react';
import { Instructor } from '../types';
import BookingModal from './BookingModal';

interface InstructorProfileProps {
  instructor: Instructor;
  onBack: () => void;
  onStartChat: () => void;
  onBook: (id: string, name: string, avatar: string, details?: any) => void;
}

const InstructorProfile: React.FC<InstructorProfileProps> = ({ instructor, onBack, onStartChat, onBook }) => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const handleBookingConfirm = (details: any) => {
    setIsBookingModalOpen(false);
    // Chama o callback de agendamento que levará o usuário para o chat com as ações rápidas
    onBook(instructor.id, instructor.name, instructor.avatar, details);
  };

  return (
    <div className="flex flex-col bg-white dark:bg-slate-950 min-h-full animate-in slide-in-from-bottom-full duration-500 pb-24">
      {/* Header Image/Banner */}
      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-blue-700">
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* Profile Info Card */}
      <div className="px-6 -mt-16 flex flex-col items-center">
        <div className="relative">
          <img 
            src={instructor.avatar} 
            alt={instructor.name} 
            className="w-32 h-32 rounded-[2.5rem] border-4 border-white dark:border-slate-900 shadow-2xl object-cover bg-white"
          />
          <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center font-black border-4 border-white dark:border-slate-900 shadow-lg">
            {instructor.licenseType}
          </div>
        </div>

        <h2 className="mt-4 text-2xl font-black text-gray-900 dark:text-white tracking-tight">{instructor.name}</h2>
        <p className="text-blue-600 dark:text-blue-400 font-bold text-sm uppercase tracking-widest">{instructor.specialty}</p>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-6 w-full mt-8 py-4 px-2 border-y border-gray-50 dark:border-slate-800">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-yellow-500">
              <Star size={18} fill="currentColor" />
              <span className="font-black text-lg">{instructor.rating}</span>
            </div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Avaliação</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-black text-lg text-gray-900 dark:text-white">R${instructor.price}</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Aula</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-black text-lg text-gray-900 dark:text-white">{instructor.distance}km</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Distância</span>
          </div>
        </div>

        {/* Bio Section */}
        <div className="w-full mt-8">
          <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-3">Sobre o Instrutor</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            {instructor.bio} Com anos de experiência no mercado de CFC, foco em resultados rápidos e confiança ao volante.
          </p>
        </div>

        {/* Quick Info Grid */}
        <div className="w-full grid grid-cols-1 gap-4 mt-8">
          <div className="flex items-center gap-4 bg-gray-50 dark:bg-slate-900 p-4 rounded-3xl border border-gray-100 dark:border-slate-800">
            <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
              <Award size={20} />
            </div>
            <div>
              <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">Certificação Prático</p>
              <p className="text-[10px] text-gray-500 font-medium tracking-tight">Instrutor verificado e credenciado</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-gray-50 dark:bg-slate-900 p-4 rounded-3xl border border-gray-100 dark:border-slate-800">
            <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-green-600 shadow-sm">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">Disponibilidade Imediata</p>
              <p className="text-[10px] text-gray-500 font-medium tracking-tight">Horários flexíveis manhã e tarde</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex gap-3 mt-10">
          <button 
            onClick={() => setIsBookingModalOpen(true)}
            className="flex-[1.5] bg-blue-600 text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-100 dark:shadow-none active:scale-95 transition-all"
          >
            Agendar Aula
          </button>
          <button 
            onClick={onStartChat}
            className="w-16 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 rounded-[2rem] flex items-center justify-center active:scale-95 transition-all border border-gray-200/50 dark:border-slate-700"
          >
            <MessageSquare size={24} />
          </button>
        </div>
      </div>

      {/* Booking Modal Overlay */}
      {isBookingModalOpen && (
        <BookingModal 
          instructor={instructor}
          onClose={() => setIsBookingModalOpen(false)}
          onConfirm={handleBookingConfirm}
        />
      )}
    </div>
  );
};

export default InstructorProfile;
