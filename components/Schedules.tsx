
import React from 'react';
import { Booking, UserRole } from '../types';
import { Calendar, Clock, MapPin, ChevronRight, Inbox } from 'lucide-react';

interface SchedulesProps {
  bookings: Booking[];
  userRole: UserRole;
  onCancel: (id: string) => void;
  onFindMore: () => void;
}

const Schedules: React.FC<SchedulesProps> = ({ bookings, userRole, onCancel, onFindMore }) => {
  const isInstructor = userRole === 'instructor';

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Minha Agenda</h2>
        <div className="text-[10px] text-blue-600 font-black bg-blue-50 px-4 py-1.5 rounded-full uppercase tracking-widest border border-blue-100/50">
          {bookings.length} {bookings.length === 1 ? 'Aula' : 'Aulas'}
        </div>
      </div>

      {bookings.length > 0 ? (
        <div className="flex flex-col gap-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col gap-6 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={booking.instructorAvatar} alt={booking.instructorName} className="w-14 h-14 rounded-2xl object-cover shadow-sm border border-gray-100" />
                  <div>
                    <h4 className="font-black text-gray-900 leading-tight">{booking.instructorName}</h4>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-0.5">{booking.subject}</p>
                  </div>
                </div>
                <div className="bg-green-50 text-green-600 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest">
                  Confirmado
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-blue-600 shadow-sm">
                    <Calendar size={16} />
                  </div>
                  <span className="text-[11px] font-bold text-gray-600">{booking.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-blue-600 shadow-sm">
                    <Clock size={16} />
                  </div>
                  <span className="text-[11px] font-bold text-gray-600">{booking.time}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-blue-50 text-blue-600 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-colors">
                  Detalhes
                </button>
                <button 
                  onClick={() => onCancel(booking.id)}
                  className="flex-1 bg-red-50 text-red-500 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-200 mb-6">
            <Inbox size={40} />
          </div>
          <p className="text-gray-400 font-bold text-sm mb-8">
            {isInstructor ? "Você não possui aulas agendadas." : "Nenhuma aula marcada para hoje."}
          </p>
          
          {!isInstructor && (
            <button 
              onClick={onFindMore}
              className="bg-blue-600 text-white px-8 py-4 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-100 active:scale-95 transition-all"
            >
              Procurar Instrutores
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Schedules;
