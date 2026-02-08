import { streamInstructors, Instructor } from '../services/instructorService';
import React, { useState, useEffect, useRef } from 'react';
import { Post, UserRole, User, MOCK_INSTRUCTORS } from '../types';
// Fixed: Added CheckCircle2 and ClipboardCheck to the imports from lucide-react
import { Heart, Bookmark, MoreHorizontal, Search, Calendar, Layers, PlusSquare, RefreshCw, Loader2, ChevronRight, Wallet, User as UserIcon, BookOpen, Clock, Fingerprint, Star, GraduationCap, CheckCircle2, ClipboardCheck } from 'lucide-react';
import { getInstructorAdvice } from '../services/geminiService';

interface FeedProps {
  user?: User;
  userName: string;
  userRole: UserRole;
  posts: Post[];
  onBook: (instructorName: string, avatar: string) => void;
  onViewSchedules: () => void;
  onSearch: () => void;
  onViewWallet: () => void;
  onCreatePost: (caption: string) => void;
  onLoadMore: () => void;
  isLoadingMore: boolean;
  onViewPractical?: () => void;
  onViewTheoretical?: () => void;
  onViewStudies?: () => void;
  onViewSimulado?: () => void;
}

const Feed: React.FC<FeedProps> = ({ user, userName, userRole, posts, onBook, onViewSchedules, onSearch, onViewWallet, onCreatePost, onLoadMore, isLoadingMore, onViewPractical, onViewTheoretical, onViewStudies, onViewSimulado }) => {
  // Esta parte cria uma "memória" para guardar os instrutores do banco
  const [dbInstructors, setDbInstructors] = React.useState<Instructor[]>([]);

  // Este comando roda assim que a página abre e busca os dados no Firebase
  React.useEffect(() => {
    console.log("Iniciando escuta do Firebase..."); // Aviso 1

    const unsubscribe = streamInstructors((data) => {
      console.log("Dados recebidos do Firebase:", data); // Aviso 2 - Aqui veremos o Rodrigo real
      setDbInstructors(data);
    });

    return () => unsubscribe();
  }, []);
  const [aiTip, setAiTip] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const isInstructor = userRole === 'instructor';
  const isCredentialed = user?.isCredentialed;

  const fetchNewTip = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    const tip = await getInstructorAdvice(isInstructor ? 'instructor' : 'student');
    if (tip) {
      setAiTip(tip);
    }
    setIsUpdating(false);
  };

  useEffect(() => {
    fetchNewTip();
    const interval = setInterval(() => {
      fetchNewTip();
    }, 120000);
    return () => clearInterval(interval);
  }, [userRole]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore && !isCredentialed) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [isLoadingMore, onLoadMore, isCredentialed]);

  const followedInstructors = dbInstructors.length > 0 ? dbInstructors : MOCK_INSTRUCTORS.slice(0, 4);

  // View para Aluno Credenciado
  if (isCredentialed) {
    return (
      <div className="flex flex-col bg-slate-50 dark:bg-slate-950 min-h-full transition-colors duration-500 pb-20">
        {/* Header de Aluno Autoescola */}
        <div className="bg-white dark:bg-slate-900 px-6 py-8 rounded-b-[2.5rem] shadow-sm border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Olá, {userName}!</h2>
              <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                <Fingerprint size={12} className="text-blue-600" />
                CPF: {user?.cpf ? `${user.cpf.slice(0, 3)}.***.***-${user.cpf.slice(-2)}` : '***.***.***-**'}
              </div>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 shadow-inner">
               <GraduationCap size={28} />
            </div>
          </div>

          <div className="bg-blue-600 rounded-[2rem] p-6 text-white shadow-2xl shadow-blue-100 dark:shadow-none relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
              <Calendar size={100} />
            </div>
            <div className="relative z-10">
              <span className="text-blue-100 text-[9px] font-black uppercase tracking-[0.25em]">Próxima Aula</span>
              <h3 className="text-xl font-black mt-1 mb-4">Direção Defensiva</h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                  <Calendar size={14} />
                  <span className="text-xs font-bold uppercase tracking-widest">22 Mai</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                  <Clock size={14} />
                  <span className="text-xs font-bold uppercase tracking-widest">08:30</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ícones de Navegação Rápida - Atualizado para 4 colunas */}
        <div className="grid grid-cols-4 gap-2 px-4 mt-8">
          <button 
            onClick={onViewPractical}
            className="bg-white dark:bg-slate-900 p-3 rounded-[1.5rem] border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col items-center gap-2 active:scale-95 transition-all"
          >
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600"><Layers size={18} /></div>
            <span className="text-[8px] font-black uppercase tracking-tight text-slate-500 dark:text-slate-400">Práticas</span>
          </button>
          <button 
            onClick={onViewTheoretical}
            className="bg-white dark:bg-slate-900 p-3 rounded-[1.5rem] border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col items-center gap-2 active:scale-95 transition-all"
          >
            <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center text-amber-600"><BookOpen size={18} /></div>
            <span className="text-[8px] font-black uppercase tracking-tight text-slate-500 dark:text-slate-400">Teóricas</span>
          </button>
          <button 
            onClick={onViewStudies}
            className="bg-white dark:bg-slate-900 p-3 rounded-[1.5rem] border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col items-center gap-2 active:scale-95 transition-all"
          >
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-600"><Star size={18} /></div>
            <span className="text-[8px] font-black uppercase tracking-tight text-slate-500 dark:text-slate-400">Estudos</span>
          </button>
          <button 
            onClick={onViewSimulado}
            className="bg-white dark:bg-slate-900 p-3 rounded-[1.5rem] border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col items-center gap-2 active:scale-95 transition-all"
          >
            <div className="w-10 h-10 bg-rose-50 dark:bg-rose-900/20 rounded-xl flex items-center justify-center text-rose-600"><ClipboardCheck size={18} /></div>
            <span className="text-[8px] font-black uppercase tracking-tight text-slate-500 dark:text-slate-400">Simulado</span>
          </button>
        </div>

        {/* Painel de Aulas Práticas */}
        <div className="px-6 mt-10" onClick={onViewPractical}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-[0.2em]">Minhas Aulas Práticas</h3>
            <ChevronRight className="text-slate-300" size={20} />
          </div>
          
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm">
             <div className="flex items-center gap-4 mb-6">
               <div className="w-14 h-14 rounded-2xl overflow-hidden border border-gray-100">
                  <img src="https://picsum.photos/seed/instrutor/100/100" className="w-full h-full object-cover" />
               </div>
               <div>
                  <h4 className="font-black text-slate-900 dark:text-white">Ricardo Mendes</h4>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Instrutor Designado</p>
               </div>
               <div className="ml-auto bg-green-50 dark:bg-green-900/20 text-green-600 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">
                  12/20
               </div>
             </div>
             
             <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                   <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Data da Aula</span>
                   <span className="text-xs font-black text-slate-700 dark:text-slate-300">Quinta, 22 Mai</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                   <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Horário</span>
                   <span className="text-xs font-black text-slate-700 dark:text-slate-300">08:30 - 09:20</span>
                </div>
             </div>
          </div>
        </div>

        {/* Painel de Aulas Teóricas */}
        <div className="px-6 mt-10" onClick={onViewTheoretical}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-[0.2em]">Painel Teórico</h3>
            <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">85% Completo</div>
          </div>

          <div className="space-y-3">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-100 dark:border-slate-800 flex items-center justify-between group cursor-pointer hover:border-blue-100 dark:hover:border-blue-900 transition-colors">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400"><CheckCircle2 size={18} className="text-green-500" /></div>
                  <div>
                     <p className="text-xs font-black text-slate-900 dark:text-white">Legislação de Trânsito</p>
                     <p className="text-[9px] font-bold text-slate-400 uppercase">Concluído • 12 Aulas</p>
                  </div>
               </div>
               <ChevronRight size={16} className="text-slate-200" />
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-100 dark:border-slate-800 flex items-center justify-between group cursor-pointer border-l-4 border-l-blue-600">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600"><Clock size={18} /></div>
                  <div>
                     <p className="text-xs font-black text-slate-900 dark:text-white">Primeiros Socorros</p>
                     <p className="text-[9px] font-bold text-blue-600 uppercase">Em progresso • Aula 3/4</p>
                  </div>
               </div>
               <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* AI Tip Adaptado para o Dashboard do Aluno */}
        <div className="px-6 mt-10">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12"><RefreshCw size={80} /></div>
            <div className="flex items-center gap-2 mb-4">
              <RefreshCw size={14} className="text-blue-400" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400">Lembrete da Autoescola</span>
            </div>
            <p className="text-sm font-bold leading-relaxed text-slate-200 italic">"Lembre-se de portar seu documento de identidade original para todas as aulas presenciais."</p>
          </div>
        </div>
      </div>
    );
  }

  // View Padrão do Feed (mantida para outros tipos de usuário)
  return (
    <div className="flex flex-col bg-white dark:bg-slate-950 transition-colors duration-500">
      
      {/* Stories Section */}
      <div className="flex gap-4 overflow-x-auto px-6 py-6 hide-scrollbar border-b border-gray-50 dark:border-slate-900">
        {followedInstructors.map((inst) => (
          <div key={inst.id} className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group">
            <div className="w-[72px] h-[72px] rounded-full p-[2.5px] bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 transition-all group-active:scale-90 shadow-lg shadow-blue-100 dark:shadow-none">
              <div className="w-full h-full rounded-full border-2 border-white dark:border-slate-950 overflow-hidden bg-gray-100">
                <img src={inst.avatar} alt={inst.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              </div>
            </div>
            <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 truncate w-16 text-center tracking-tighter uppercase mt-0.5">
              {inst.name.split(' ')[0]}
            </span>
          </div>
        ))}
        {!isInstructor && (
          <div 
            onClick={onSearch}
            className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group"
          >
            <div className="w-[72px] h-[72px] rounded-full border-2 border-dashed border-gray-200 dark:border-slate-800 flex items-center justify-center text-gray-400 group-hover:text-blue-500 group-hover:border-blue-500 transition-all bg-gray-50/50 dark:bg-slate-900/50">
              <PlusSquare size={24} />
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mt-0.5">Buscar</span>
          </div>
        )}
      </div>

      {/* AI Tip Section */}
      <div className="px-6 py-5">
        <div className={`bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-gray-100 dark:border-slate-800 shadow-sm transition-all duration-500 relative min-h-[100px] flex flex-col justify-center overflow-hidden`}>
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] rotate-12">
            <Layers size={80} />
          </div>
          <div className="flex items-center gap-2 mb-3 relative z-10">
            <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-md">
              <Layers size={12} />
            </div>
            <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 tracking-widest uppercase">
              {isInstructor ? 'INSIGHT PROFISSIONAL IA' : 'DICA PRÁTICO IA'}
            </span>
            <button 
              onClick={fetchNewTip} 
              disabled={isUpdating}
              className={`ml-auto p-1.5 text-gray-300 hover:text-blue-500 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-full transition-all ${isUpdating ? 'animate-spin opacity-50' : 'opacity-100'}`}
            >
              <RefreshCw size={14} />
            </button>
          </div>
          <div className={`relative z-10 transition-all duration-300 ${isUpdating ? 'opacity-30 blur-[2px]' : 'opacity-100 blur-0'}`}>
            <p className="text-gray-700 dark:text-blue-100 font-bold text-[13px] leading-relaxed italic">
              {aiTip ? `"${aiTip}"` : "Carregando dica estratégica..."}
            </p>
          </div>
        </div>
      </div>

      {/* Main Feed Content */}
      <div className="flex flex-col gap-6 bg-white dark:bg-slate-950 pb-24 transition-colors duration-500">
        
        {/* Action Cards Grid */}
        <div className="grid grid-cols-2 gap-4 px-6">
          <button 
            onClick={isInstructor ? onViewWallet : onSearch}
            className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[2.5rem] p-6 text-left shadow-2xl shadow-blue-100 dark:shadow-none hover:shadow-blue-200 active:scale-95 transition-all flex flex-col justify-between h-40 group relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white relative z-10 shadow-inner">
              {isInstructor ? <Wallet size={24} strokeWidth={2.5} /> : <Search size={24} strokeWidth={2.5} />}
            </div>
            <div className="relative z-10">
              <span className="text-white font-black text-xs uppercase tracking-[0.15em] leading-tight">
                {isInstructor ? 'VER MINHA' : 'BUSCAR'}
                <br/>
                <span className="text-lg">{isInstructor ? 'CARTEIRA' : 'INSTRUTOR'}</span>
              </span>
            </div>
          </button>
          
          <button 
            onClick={onViewSchedules}
            className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-700 rounded-[2.5rem] p-6 text-left shadow-2xl shadow-gray-200 dark:shadow-none hover:from-black hover:to-slate-900 active:scale-[0.97] transition-all flex flex-col justify-between h-40 group relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white relative z-10 shadow-inner">
              <Calendar size={24} strokeWidth={2.5} />
            </div>
            <div className="relative z-10">
              <span className="text-white font-black text-xs uppercase tracking-[0.15em] leading-tight">VER MINHA<br/><span className="text-lg">AGENDA</span></span>
            </div>
          </button>
        </div>

        {/* Header - Novidades para você */}
        <div className="px-6 pt-2">
          <h3 className="font-black text-xl text-gray-900 dark:text-white tracking-tight">
            Novidades para você
          </h3>
        </div>

        {/* Posts Loop */}
        <div className="flex flex-col gap-10">
          {posts.map((post) => (
            <div key={post.id} className="bg-white dark:bg-slate-950 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between px-6 mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-[2px] bg-gradient-to-tr from-blue-400 to-blue-600 rounded-full shadow-sm">
                    <img src={post.instructorAvatar} alt={post.instructorName} className="w-11 h-11 rounded-full object-cover border-2 border-white dark:border-slate-900" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="font-black text-[14px] tracking-tight text-slate-900 dark:text-gray-100 leading-tight">
                      {post.instructorName}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-gray-400 font-bold tracking-tight">
                      {post.instructorCategory}
                    </span>
                  </div>
                </div>
                <button className="text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors p-1">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <div className="w-full px-6 relative group">
                <img 
                  src={post.imageUrl} 
                  alt="Post content" 
                  className="w-full aspect-square object-cover rounded-[2.5rem] shadow-2xl shadow-gray-200 dark:shadow-none transition-transform duration-700 group-hover:scale-[1.02]"
                  loading="lazy"
                />
                <div className="absolute top-10 right-10 bg-white/30 backdrop-blur-md p-2.5 rounded-full text-white shadow-lg active:scale-90 transition-transform cursor-pointer">
                  <Bookmark size={20} fill="currentColor" />
                </div>
              </div>

              <div className="px-8 pt-6">
                <div className="flex gap-5 mb-4 items-center">
                  <Heart size={26} className="text-gray-900 dark:text-white hover:text-red-500 transition-colors cursor-pointer active:scale-125" />
                  <span className="ml-auto text-[10px] text-gray-400 font-black uppercase tracking-widest">
                    {post.likes} CURTIDAS
                  </span>
                </div>
                <div className="text-sm leading-relaxed mb-6">
                  <p className="text-gray-800 dark:text-gray-300 font-medium">
                    <span className="font-black mr-2 text-gray-900 dark:text-white">{post.instructorName.split(' ')[0]}</span>
                    {post.caption}
                  </p>
                </div>
                
                {!isInstructor && (
                  <button 
                    onClick={() => onBook(post.instructorName, post.instructorAvatar)}
                    className="group w-full relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-blue-100 dark:shadow-none hover:shadow-blue-200 hover:-translate-y-0.5 transition-all active:scale-[0.97] flex items-center justify-center gap-2"
                  >
                    <Calendar size={16} strokeWidth={3} />
                    <span className="relative z-10">Agendar Aula Prática</span>
                    <ChevronRight size={14} strokeWidth={3} className="opacity-50 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
            </div>
          ))}
          
          <div ref={observerRef} className="h-20 flex items-center justify-center">
            {isLoadingMore && (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="animate-spin text-blue-600" size={32} />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Gerando mais novidades...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
