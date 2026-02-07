
import React, { useState, useEffect } from 'react';
import { Layers, BookOpen, Clock, Calendar, CheckCircle2, ChevronRight, User as UserIcon } from 'lucide-react';

interface ClassesViewProps {
  initialMode?: 'practical' | 'theoretical';
}

const PracticalList = () => {
  const classes = [
    { id: 1, instructor: 'Ricardo Mendes', date: '22 Mai', day: 'Quinta-feira', time: '08:30 - 09:20', status: 'upcoming', lessonNum: 13 },
    { id: 2, instructor: 'Ricardo Mendes', date: '23 Mai', day: 'Sexta-feira', time: '08:30 - 09:20', status: 'upcoming', lessonNum: 14 },
    { id: 3, instructor: 'Ricardo Mendes', date: '20 Mai', day: 'Terça-feira', time: '09:00 - 09:50', status: 'completed', lessonNum: 12 },
    { id: 4, instructor: 'Ricardo Mendes', date: '18 Mai', day: 'Domingo', time: '10:00 - 10:50', status: 'completed', lessonNum: 11 },
  ];

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500">
      {classes.map((c) => (
        <div key={c.id} className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-100">
                <img src={`https://picsum.photos/seed/ricardo${c.id}/100/100`} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-black text-sm text-slate-900 dark:text-white">{c.instructor}</h4>
                <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Aula #{c.lessonNum}</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
              c.status === 'upcoming' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
            }`}>
              {c.status === 'upcoming' ? 'Agendada' : 'Concluída'}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl flex items-center gap-2">
              <Calendar size={14} className="text-slate-400" />
              <div>
                <span className="block text-[8px] font-black text-slate-400 uppercase leading-none">Data</span>
                <span className="text-[11px] font-black text-slate-700 dark:text-slate-300">{c.date}</span>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl flex items-center gap-2">
              <Clock size={14} className="text-slate-400" />
              <div>
                <span className="block text-[8px] font-black text-slate-400 uppercase leading-none">Horário</span>
                <span className="text-[11px] font-black text-slate-700 dark:text-slate-300">{c.time.split(' - ')[0]}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const TheoreticalList = () => {
  const subjects = [
    { id: 1, name: 'Primeiros Socorros', instructor: 'Profa. Eliane', date: '22 Mai', time: '19:00 - 21:30', status: 'today' },
    { id: 2, name: 'Legislação de Trânsito', instructor: 'Prof. Marcos', date: '23 Mai', time: '19:00 - 21:30', status: 'upcoming' },
    { id: 3, name: 'Direção Defensiva', instructor: 'Prof. Marcos', date: '24 Mai', time: '19:00 - 21:30', status: 'upcoming' },
    { id: 4, name: 'Meio Ambiente', instructor: 'Profa. Sandra', date: '15 Mai', time: '19:00 - 21:30', status: 'completed' },
  ];

  return (
    <div className="flex flex-col gap-3 animate-in fade-in duration-500">
      {subjects.map((s) => (
        <div key={s.id} className={`bg-white dark:bg-slate-900 p-5 rounded-[2rem] border ${s.status === 'today' ? 'border-amber-200' : 'border-gray-100'} dark:border-slate-800 shadow-sm flex items-center justify-between`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              s.status === 'completed' ? 'bg-green-50 text-green-600' : s.status === 'today' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
            }`}>
              {s.status === 'completed' ? <CheckCircle2 size={24} /> : <BookOpen size={24} />}
            </div>
            <div>
              <h4 className="font-black text-sm text-slate-900 dark:text-white tracking-tight">{s.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.date} • {s.time.split(' - ')[0]}</span>
                {s.status === 'today' && <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>}
              </div>
            </div>
          </div>
          <ChevronRight className="text-slate-200" size={18} />
        </div>
      ))}
    </div>
  );
};

const ClassesView: React.FC<ClassesViewProps> = ({ initialMode = 'practical' }) => {
  const [mode, setMode] = useState<'practical' | 'theoretical'>(initialMode);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  return (
    <div className="flex flex-col bg-slate-50 dark:bg-slate-950 min-h-full pb-20">
      {/* Search Header Style */}
      <div className="bg-white dark:bg-slate-900 px-6 pt-8 pb-6 border-b border-gray-100 dark:border-slate-800 shadow-sm">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-6">Minha Jornada</h2>
        
        <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-[1.75rem] flex items-center">
          <button 
            onClick={() => setMode('practical')}
            className={`flex-1 py-3.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
              mode === 'practical' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            <Layers size={14} /> Aulas Práticas
          </button>
          <button 
            onClick={() => setMode('theoretical')}
            className={`flex-1 py-3.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
              mode === 'theoretical' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            <BookOpen size={14} /> Aulas Teóricas
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em]">
            {mode === 'practical' ? 'Cronograma Prático' : 'Grade de Aulas Teóricas'}
          </h3>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
             <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Sincronizado</span>
          </div>
        </div>

        {mode === 'practical' ? <PracticalList /> : <TheoreticalList />}
      </div>
      
      {/* Floating Info */}
      <div className="px-6 mt-4">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-5">
           <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-[1.75rem] flex items-center justify-center text-blue-600">
              <UserIcon size={28} />
           </div>
           <div>
              <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">Responsável na Unidade</p>
              <h4 className="font-black text-slate-900 dark:text-white text-sm">CFC Piloto - Matriz</h4>
              <p className="text-[10px] font-bold text-blue-600 underline">Falar com recepção</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ClassesView;
