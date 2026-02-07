
import React, { useState } from 'react';
import { BookOpen, Star, CheckCircle2, ChevronRight, FileText, PlayCircle, Trophy, GraduationCap, ArrowLeft, BookCheck } from 'lucide-react';

interface Lesson {
  id: number;
  title: string;
  content: string;
  isRead: boolean;
}

interface Module {
  id: number;
  title: string;
  lessons: number;
  progress: number;
  status: 'completed' | 'active' | 'locked';
  icon: React.ReactNode;
  content: Lesson[];
}

interface StudiesViewProps {
  onStartSimulado?: () => void;
}

const MODULES_DATA: Module[] = [
  { 
    id: 1, 
    title: 'Legislação de Trânsito', 
    lessons: 3, 
    progress: 100, 
    status: 'completed',
    icon: <BookOpen className="text-blue-600" />,
    content: [
      { id: 101, title: 'Introdução ao CTB', content: 'O Código de Trânsito Brasileiro (CTB) é o documento que rege o trânsito em todo o território nacional. Ele estabelece normas de conduta, infrações e penalidades para motoristas e pedestres. Conhecer o CTB é o primeiro passo para uma direção segura e legal.', isRead: true },
      { id: 102, title: 'Sinalização Vertical', content: 'As placas de sinalização são divididas em: Regulamentação (vermelhas), Advertência (amarelas) e Indicação (azuis/verdes). As de regulamentação indicam obrigações ou restrições, e seu desrespeito constitui infração.', isRead: true },
      { id: 103, title: 'Sinalização Horizontal', content: 'Marcas no pavimento como faixas de pedestre, linhas de divisão de fluxo (contínuas ou seccionadas) e setas direcionais. Linhas amarelas dividem fluxos opostos, enquanto brancas dividem fluxos de mesmo sentido.', isRead: true },
    ]
  },
  { 
    id: 2, 
    title: 'Direção Defensiva', 
    lessons: 2, 
    progress: 80, 
    status: 'active',
    icon: <Star className="text-amber-600" />,
    content: [
      { id: 201, title: 'Conceitos Básicos', content: 'Direção defensiva é o conjunto de técnicas que permite ao condutor reconhecer antecipadamente situações de perigo e agir para evitar acidentes, apesar das ações incorretas dos outros e das condições adversas.', isRead: true },
      { id: 202, title: 'Condições Adversas', content: 'Luz, tempo, estrada, trânsito, veículo e condutor são os seis principais fatores que podem influenciar a segurança. Estar atento à chuva, neblina ou cansaço é fundamental para evitar colisões.', isRead: false },
    ]
  },
  { 
    id: 3, 
    title: 'Primeiros Socorros', 
    lessons: 2, 
    progress: 50, 
    status: 'active',
    icon: <PlayCircle className="text-rose-600" />,
    content: [
      { id: 301, title: 'Sinalização do Local', content: 'Ao presenciar um acidente, a primeira ação é garantir a própria segurança e sinalizar o local para evitar novos acidentes. Utilize o triângulo e galhos, respeitando a distância conforme a velocidade da via.', isRead: true },
      { id: 302, title: 'Acionando o Resgate', content: 'Ligue imediatamente para 192 (SAMU) ou 193 (Bombeiros). Informe a localização exata, número de vítimas e estado aparente. Nunca tente remover vítimas presas ou movimentar pessoas com suspeita de lesão na coluna.', isRead: false },
    ]
  },
  { 
    id: 4, 
    title: 'Meio Ambiente e Cidadania', 
    lessons: 1, 
    progress: 0, 
    status: 'locked',
    icon: <FileText className="text-emerald-600" />,
    content: [
      { id: 401, title: 'Poluição Veicular', content: 'Veículos emitem gases poluentes e ruídos. A manutenção correta do motor e do sistema de escapamento reduz o impacto ambiental e economiza combustível.', isRead: false },
    ]
  },
  { 
    id: 5, 
    title: 'Mecânica Básica', 
    lessons: 1, 
    progress: 0, 
    status: 'locked',
    icon: <FileText className="text-indigo-600" />,
    content: [
      { id: 501, title: 'Painel de Instrumentos', content: 'As luzes do painel indicam o estado do veículo. Luzes vermelhas indicam problemas graves que exigem parada imediata, como pressão do óleo ou superaquecimento.', isRead: false },
    ]
  },
];

const StudiesView: React.FC<StudiesViewProps> = ({ onStartSimulado }) => {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const handleBackToModules = () => setSelectedModule(null);
  const handleBackToLessons = () => setSelectedLesson(null);

  if (selectedLesson) {
    return (
      <div className="flex flex-col bg-white dark:bg-slate-950 min-h-full pb-20 animate-in fade-in slide-in-from-right-4 duration-300">
        <header className="px-6 py-6 sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md flex items-center border-b border-gray-50 dark:border-slate-900 z-10">
          <button onClick={handleBackToLessons} className="p-2.5 bg-gray-50 dark:bg-slate-900 rounded-2xl text-slate-900 dark:text-white transition-all shadow-sm mr-4">
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
          <div className="flex-1">
            <p className="text-[8px] font-black text-blue-600 uppercase tracking-[0.2em] mb-0.5">{selectedModule?.title}</p>
            <h3 className="text-sm font-black text-slate-900 dark:text-white truncate">{selectedLesson.title}</h3>
          </div>
        </header>

        <div className="p-8 space-y-6">
          <div className="prose dark:prose-invert max-w-none">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-6 leading-tight">{selectedLesson.title}</h1>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base font-medium">
              {selectedLesson.content}
            </p>
            <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Dica do Professor</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 italic">"Este tema cai com frequência nas provas do DETRAN. Preste atenção aos detalhes sobre as cores das sinalizações!"</p>
            </div>
          </div>
          
          <button 
            onClick={handleBackToLessons}
            className="w-full bg-blue-600 text-white py-5 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-200 dark:shadow-none mt-10 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <BookCheck size={18} /> Marcar como Lida
          </button>
        </div>
      </div>
    );
  }

  if (selectedModule) {
    return (
      <div className="flex flex-col bg-slate-50 dark:bg-slate-950 min-h-full pb-20 animate-in fade-in slide-in-from-right-4 duration-300">
        <header className="bg-white dark:bg-slate-900 px-6 pt-8 pb-8 border-b border-gray-100 dark:border-slate-800 rounded-b-[3rem] shadow-sm">
          <button onClick={handleBackToModules} className="mb-6 p-2.5 bg-gray-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-blue-600 transition-colors">
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center shadow-inner">
              {selectedModule.icon}
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{selectedModule.title}</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{selectedModule.lessons} Aulas Disponíveis</p>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-4 ml-2">Lista de Aulas</h3>
          {selectedModule.content.map((lesson) => (
            <button 
              key={lesson.id}
              onClick={() => setSelectedLesson(lesson)}
              className="w-full bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-4 text-left">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${lesson.isRead ? 'bg-green-50 text-green-500' : 'bg-blue-50 text-blue-600'}`}>
                  {lesson.isRead ? <CheckCircle2 size={18} /> : <FileText size={18} />}
                </div>
                <div>
                  <h4 className="font-black text-slate-900 dark:text-white text-sm">{lesson.title}</h4>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{lesson.isRead ? 'Lida' : 'Disponível'}</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-200 group-hover:text-blue-500 transition-colors" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-slate-50 dark:bg-slate-950 min-h-full pb-20 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-900 px-6 pt-8 pb-10 border-b border-gray-100 dark:border-slate-800 rounded-b-[2.5rem] shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Central de Estudos</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Sua preparação teórica</p>
          </div>
          <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
            <Trophy size={28} />
          </div>
        </div>

        <div className="bg-slate-900 dark:bg-slate-800 rounded-[2rem] p-7 text-white relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/5 rounded-full blur-2xl transition-transform duration-700 group-hover:scale-150"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400">Progresso Geral do Curso</span>
              <span className="text-xl font-black">68%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden border border-white/5 shadow-inner">
              <div className="w-[68%] h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-xl border border-white/5">
                <GraduationCap size={16} className="text-blue-300" />
              </div>
              <p className="text-[11px] font-bold text-slate-300">Você já concluiu 2 de 5 módulos teóricos.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-6 ml-2">Módulos de Aprendizado</h3>
        
        <div className="flex flex-col gap-4">
          {MODULES_DATA.map((mod) => (
            <div 
              key={mod.id} 
              onClick={() => mod.status !== 'locked' && setSelectedModule(mod)}
              className={`bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col group transition-all ${
                mod.status === 'locked' ? 'opacity-60 grayscale cursor-not-allowed' : 'hover:border-blue-200 dark:hover:border-blue-900 cursor-pointer active:scale-[0.98]'
              }`}
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-inner">
                    {mod.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 dark:text-white tracking-tight">{mod.title}</h4>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{mod.lessons} Aulas • {mod.status === 'completed' ? 'Finalizado' : 'Em andamento'}</p>
                  </div>
                </div>
                {mod.status === 'completed' ? (
                  <div className="w-8 h-8 bg-green-50 text-green-500 rounded-full flex items-center justify-center"><CheckCircle2 size={20} /></div>
                ) : (
                  <ChevronRight className="text-slate-200" size={20} />
                )}
              </div>

              {mod.status !== 'locked' && (
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-slate-400">
                    <span>Progresso</span>
                    <span>{mod.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${mod.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${mod.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 mt-4">
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-200 dark:shadow-none relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10"><PlayCircle size={100} /></div>
           <div className="relative z-10">
              <h4 className="text-lg font-black tracking-tight mb-2">Simulado DETRAN</h4>
              <p className="text-blue-100 text-xs font-bold leading-relaxed mb-6">Teste seus conhecimentos com nosso simulador oficial e garanta sua aprovação na prova teórica.</p>
              <button 
                onClick={onStartSimulado}
                className="bg-white text-indigo-700 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all"
              >
                Iniciar Simulado
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StudiesView;
