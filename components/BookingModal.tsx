
import React, { useState, useMemo } from 'react';
import { X, Calendar, Clock, Car, Bike, CreditCard, Zap, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';
import { Instructor, LicenseType } from '../types';

interface BookingModalProps {
  instructor: Instructor;
  onClose: () => void;
  onConfirm: (bookingDetails: any) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ instructor, onClose, onConfirm }) => {
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');
  const [selectedDateIdx, setSelectedDateIdx] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<LicenseType>(instructor.licenseType === 'AB' ? 'B' : instructor.licenseType);
  const [duration, setDuration] = useState<50 | 100>(50);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');

  // Gerar dinamicamente os próximos 14 dias a partir de hoje
  const days = useMemo(() => {
    const list = [];
    const today = new Date();
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const fullMonths = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      list.push({
        day: weekDays[d.getDay()],
        date: d.getDate().toString().padStart(2, '0'),
        month: months[d.getMonth()],
        fullMonth: fullMonths[d.getMonth()],
        year: d.getFullYear()
      });
    }
    return list;
  }, []);

  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

  const handleConfirm = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onConfirm({
          instructorId: instructor.id,
          date: `${days[selectedDateIdx].date} ${days[selectedDateIdx].month}`,
          time: selectedTime,
          category: selectedCategory,
          duration
        });
      }, 1500);
    }, 2000);
  };

  const isCarAvailable = instructor.licenseType === 'B' || instructor.licenseType === 'AB';
  const isMotoAvailable = instructor.licenseType === 'A' || instructor.licenseType === 'AB';

  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
        <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[3rem] p-10 text-center shadow-2xl animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-500 mx-auto mb-6">
            <CheckCircle2 size={48} strokeWidth={2.5} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Aula Agendada!</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-8">
            Tudo pronto! Sua aula com {instructor.name.split(' ')[0]} foi confirmada na agenda.
          </p>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 mb-8 text-left border border-slate-100 dark:border-slate-700">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Resumo do Agendamento</p>
            <p className="text-sm font-black text-slate-700 dark:text-slate-200">
              {days[selectedDateIdx].day}, {days[selectedDateIdx].date} de {days[selectedDateIdx].fullMonth} às {selectedTime}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
        <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[3rem] p-12 text-center shadow-2xl">
          <Loader2 size={64} className="text-blue-600 animate-spin mx-auto mb-6" />
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Processando Pagamento</h3>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Validando transação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-[3rem] sm:rounded-[3rem] max-h-[90vh] overflow-y-auto hide-scrollbar shadow-2xl animate-in slide-in-from-bottom-full duration-500">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center z-10">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Agendar Aula</h3>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Instrutor: {instructor.name}</p>
          </div>
          <button onClick={onClose} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 hover:rotate-90 transition-transform">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Categoria e Duração */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoria</label>
              <div className="flex bg-slate-50 dark:bg-slate-800 p-1 rounded-2xl">
                <button 
                  disabled={!isCarAvailable}
                  onClick={() => setSelectedCategory('B')}
                  className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl transition-all ${
                    selectedCategory === 'B' 
                      ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' 
                      : !isCarAvailable 
                        ? 'opacity-20 cursor-not-allowed grayscale' 
                        : 'text-slate-400'
                  }`}
                >
                  <Car size={18} />
                  <span className="text-[10px] font-black">B</span>
                </button>
                <button 
                  disabled={!isMotoAvailable}
                  onClick={() => setSelectedCategory('A')}
                  className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl transition-all ${
                    selectedCategory === 'A' 
                      ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' 
                      : !isMotoAvailable 
                        ? 'opacity-20 cursor-not-allowed grayscale' 
                        : 'text-slate-400'
                  }`}
                >
                  <Bike size={18} />
                  <span className="text-[10px] font-black">A</span>
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duração</label>
              <div className="flex bg-slate-50 dark:bg-slate-800 p-1 rounded-2xl">
                <button 
                  onClick={() => setDuration(50)}
                  className={`flex-1 py-3 rounded-xl transition-all text-[10px] font-black ${duration === 50 ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-400'}`}
                >
                  50min
                </button>
                <button 
                  onClick={() => setDuration(100)}
                  className={`flex-1 py-3 rounded-xl transition-all text-[10px] font-black ${duration === 100 ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-400'}`}
                >
                  100min
                </button>
              </div>
            </div>
          </div>

          {/* Calendário Horizontal Sincronizado */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selecione o Dia</label>
              <span className="text-[10px] font-black text-blue-600 uppercase">
                {days[selectedDateIdx].fullMonth} {days[selectedDateIdx].year}
              </span>
            </div>
            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 cursor-grab active:cursor-grabbing snap-x">
              {days.map((d, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDateIdx(idx)}
                  className={`flex-shrink-0 w-16 h-20 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border snap-center ${
                    selectedDateIdx === idx 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' 
                      : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 hover:border-blue-100 dark:hover:border-slate-600'
                  }`}
                >
                  <span className="text-[9px] font-black uppercase tracking-widest">{d.day}</span>
                  <span className="text-lg font-black">{d.date}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Horários Disponíveis */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Horários Disponíveis</label>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`py-3 rounded-xl font-black text-[11px] transition-all border ${
                    selectedTime === time 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                      : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-600 dark:text-slate-400 hover:border-slate-200'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Forma de Pagamento */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Forma de Pagamento</label>
            <div className="space-y-2">
              <button 
                onClick={() => setPaymentMethod('pix')}
                className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${paymentMethod === 'pix' ? 'bg-blue-50/50 border-blue-600 dark:bg-blue-900/10' : 'bg-slate-50 dark:bg-slate-800 border-transparent'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${paymentMethod === 'pix' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                    <Zap size={18} fill="currentColor" />
                  </div>
                  <div className="text-left">
                    <span className="block text-sm font-black text-slate-900 dark:text-white">Pix Instantâneo</span>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase">Confirmação imediata</span>
                  </div>
                </div>
                {paymentMethod === 'pix' && <CheckCircle2 size={18} className="text-blue-600" />}
              </button>

              <button 
                onClick={() => setPaymentMethod('card')}
                className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${paymentMethod === 'card' ? 'bg-blue-50/50 border-blue-600 dark:bg-blue-900/10' : 'bg-slate-50 dark:bg-slate-800 border-transparent'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${paymentMethod === 'card' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                    <CreditCard size={18} />
                  </div>
                  <div className="text-left">
                    <span className="block text-sm font-black text-slate-900 dark:text-white">Cartão de Crédito</span>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase">Até 12x no app</span>
                  </div>
                </div>
                {paymentMethod === 'card' && <CheckCircle2 size={18} className="text-blue-600" />}
              </button>
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-4 pb-2">
            <button 
              disabled={!selectedTime}
              onClick={handleConfirm}
              className={`w-full py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center gap-3 ${
                selectedTime 
                  ? 'bg-blue-600 text-white shadow-blue-100 active:scale-95' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Confirmar e Pagar R$ {instructor.price * (duration / 50)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
