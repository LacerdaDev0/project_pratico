
import React, { useState, useEffect, useRef } from 'react';
import { Post, UserRole, MOCK_INSTRUCTORS } from '../types';
import { Heart, Bookmark, MoreHorizontal, Search, Calendar, Layers, PlusSquare, RefreshCw, Loader2, ChevronRight, Wallet } from 'lucide-react';
import { getInstructorAdvice } from '../services/geminiService';

interface FeedProps {
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
}

const Feed: React.FC<FeedProps> = ({ userName, userRole, posts, onBook, onViewSchedules, onSearch, onViewWallet, onCreatePost, onLoadMore, isLoadingMore }) => {
  const [aiTip, setAiTip] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const isInstructor = userRole === 'instructor';

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
        if (entries[0].isIntersecting && !isLoadingMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [isLoadingMore, onLoadMore]);

  const recommendedInstructors = MOCK_INSTRUCTORS.slice(3, 6);
  const followedInstructors = MOCK_INSTRUCTORS.slice(0, 4);

  return (
    <div className="flex flex-col bg-white dark:bg-slate-950 transition-colors duration-500">
      
      {/* Stories Section - Style Instagram (Updated Purple Theme) */}
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
            className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-700 rounded-[2.5rem] p-6 text-left shadow-2xl shadow-gray-200 dark:shadow-none hover:from-black hover:to-slate-900 active:scale-95 transition-all flex flex-col justify-between h-40 group relative overflow-hidden"
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

        {/* Algorithm Recommendation Section */}
        <div className="bg-gray-50/70 dark:bg-slate-900/50 py-10 px-6 mt-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-black text-lg text-gray-900 dark:text-white leading-tight">Recomendados para você</h3>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Instrutores perto da sua localidade</p>
            </div>
            <button onClick={onSearch} className="text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline">Ver Tudo</button>
          </div>

          <div className="flex gap-5 overflow-x-auto hide-scrollbar pb-4">
            {recommendedInstructors.map((inst) => (
              <div key={inst.id} className="bg-white dark:bg-slate-950 p-6 rounded-[3rem] shadow-xl shadow-gray-100 dark:shadow-none border border-gray-100 dark:border-slate-800 flex flex-col items-center text-center min-w-[220px] flex-shrink-0 animate-in zoom-in duration-500">
                <div className="relative mb-5">
                  <img src={inst.avatar} alt={inst.name} className="w-24 h-24 rounded-[2rem] object-cover shadow-lg" />
                  <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white text-[9px] font-black px-2.5 py-1.5 rounded-xl border-4 border-white dark:border-slate-950">
                    {inst.distance}km
                  </div>
                </div>
                <h4 className="font-black text-gray-900 dark:text-white text-base mb-1">{inst.name}</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-6">{inst.specialty}</p>
                <button 
                  onClick={() => onBook(inst.name, inst.avatar)}
                  className="w-full bg-gray-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all border border-blue-50 dark:border-transparent"
                >
                  Ver Perfil
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
