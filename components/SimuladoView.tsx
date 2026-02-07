
import React, { useState } from 'react';
import { ClipboardCheck, ArrowLeft, ChevronRight, Clock, Target, Play, BookOpen, Star, PlayCircle, FileText, LayoutGrid, Minus, Plus, Check, ShieldAlert, Wrench, Users, BriefcaseMedical, AlertTriangle, Compass, Sparkles } from 'lucide-react';

interface Subject {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const SUBJECTS: Subject[] = [
  { id: 'direcao', name: 'Direção Defensiva', icon: <ShieldAlert size={18} /> },
  { id: 'mecanica', name: 'Mecânica Básica', icon: <Wrench size={18} /> },
  { id: 'cidadania', name: 'Cidadania e Meio ambiente', icon: <Users size={18} /> },
  { id: 'primeiros', name: 'Primeiros Socorros', icon: <BriefcaseMedical size={18} /> },
  { id: 'infracoes', name: 'Infrações e Penalidades', icon: <AlertTriangle size={18} /> },
  { id: 'circulacao', name: 'Circulação e Conduta', icon: <Compass size={18} /> },
  { id: 'todas', name: 'Todas as matérias', icon: <ClipboardCheck size={18} /> },
];

const SimuladoView: React.FC = () => {
  const [duration, setDuration] = useState<number>(15);
  const [questions, setQuestions] = useState<number>(30);
  const [isStarted, setIsStarted] = useState(false);
  const [activeSubject, setActiveSubject] = useState<Subject | null>(null);

  const adjustDuration = (amount: number) => {
    setDuration(prev => {
      const next = prev + amount;
      if (next < 5) return 5;
      if (next > 40) return 40;
      return next;
    });
  };

  const adjustQuestions = (amount: number) => {
    setQuestions(prev => {
      const next = prev + amount;
      if (next < 5) return 5;
      if (next > 40) return 40;
      return next;
    });
  };

  const handleStartSimulado = (subject: Subject) => {
    setActiveSubject(subject);
    setIsStarted(true);
  };

  if (isStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-8 text-center bg-white dark:bg-slate-950 animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-[2rem] flex items-center justify-center text-blue-600 mb-6 shadow-inner animate-pulse">
          <Clock size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Simulado Iniciado</h2>
        <div className="space-y-1 mb-8">
           <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">
             Disciplina: {activeSubject?.name}
           </p>
           <p className="text-blue-600 dark:text-blue-400 font-black text-lg uppercase tracking-widest">
             {questions} Questões • {duration} Minutos
           </p>
        </div>
        <button 
          onClick={() => setIsStarted(false)}
          className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all"
        >
          Finalizar Agora (Demo)
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-slate-50 dark:bg-slate-950 min-h-full pb-20 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-900 px-8 pt-12 pb-10 border-b border-gray-100 dark:border-slate-800 rounded-b-[3.5rem] shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-blue-600" />
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Preparação Oficial</span>
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-3">Simulado teórico</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold leading-relaxed max-w-[280px]">
          Teste seus conhecimentos antes da prova oficial e garanta sua aprovação com foco total.
        </p>
      </div>

      <div className="px-6 space-y-3">
        {/* Seletor de Duração Mais Moderno e Compacto */}
        <div className="bg-white dark:bg-slate-900 p-3 pl-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
          <div className="flex items-center gap-4 flex-1">
             <span className="text-[11px] font-black text-slate-900 dark:text-slate-200 uppercase tracking-widest">Duração:</span>
             <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-xl">
                <button 
                  onClick={() => adjustDuration(-5)}
                  className="p-1 text-slate-300 hover:text-amber-500 transition-colors"
                >
                  <Minus size={18} strokeWidth={4} />
                </button>
                <span className="text-sm font-black text-slate-800 dark:text-slate-100 min-w-[50px] text-center">
                  {duration} min
                </span>
                <button 
                  onClick={() => adjustDuration(5)}
                  className="p-1 text-amber-500 hover:text-amber-600 transition-colors"
                >
                  <Plus size={18} strokeWidth={4} />
                </button>
             </div>
          </div>
          <div className="ml-2">
            <div className="w-10 h-10 bg-amber-400 text-white rounded-xl flex items-center justify-center shadow-lg shadow-amber-100 dark:shadow-none active:scale-95 transition-all">
              <Check size={20} strokeWidth={3} />
            </div>
          </div>
        </div>

        {/* Seletor de Questões Mais Moderno e Compacto */}
        <div className="bg-white dark:bg-slate-900 p-3 pl-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
          <div className="flex items-center gap-4 flex-1">
             <span className="text-[11px] font-black text-slate-900 dark:text-slate-200 uppercase tracking-widest">Questões:</span>
             <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-xl">
                <button 
                  onClick={() => adjustQuestions(-5)}
                  className="p-1 text-slate-300 hover:text-blue-600 transition-colors"
                >
                  <Minus size={18} strokeWidth={4} />
                </button>
                <span className="text-sm font-black text-slate-800 dark:text-slate-100 min-w-[50px] text-center">
                  {questions} un
                </span>
                <button 
                  onClick={() => adjustQuestions(5)}
                  className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Plus size={18} strokeWidth={4} />
                </button>
             </div>
          </div>
          <div className="ml-2">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-100 dark:shadow-none active:scale-95 transition-all">
              <Play size={16} strokeWidth={3} fill="currentColor" />
            </div>
          </div>
        </div>

        {/* Lista de Disciplinas Estilo Moderno */}
        <div className="space-y-3 pt-6">
          <div className="px-2 mb-2">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Escolha a disciplina</h3>
          </div>
          {SUBJECTS.map((subject) => (
            <button
              key={subject.id}
              onClick={() => handleStartSimulado(subject)}
              className="w-full bg-white dark:bg-slate-900 p-5 rounded-[1.75rem] border border-gray-50 dark:border-slate-800 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all hover:border-blue-200 dark:hover:border-blue-900 hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
            >
              <span className="text-[15px] font-black text-slate-700 dark:text-slate-300 text-left tracking-tight">
                {subject.name}
              </span>
              <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-300 group-hover:text-blue-600 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-all border border-transparent group-hover:border-blue-100 dark:group-hover:border-blue-900/50">
                {subject.icon}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimuladoView;
