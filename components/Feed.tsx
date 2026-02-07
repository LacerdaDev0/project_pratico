
import React, { useState, useEffect } from 'react';
import { Post, UserRole } from '../types';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Search, Calendar, Layers, PlusSquare, X, RefreshCw } from 'lucide-react';
import { getInstructorAdvice } from '../services/geminiService';

interface FeedProps {
  userName: string;
  userRole: UserRole;
  posts: Post[];
  onBook: (instructorName: string, avatar: string) => void;
  onViewSchedules: () => void;
  onSearch: () => void;
  onCreatePost: (caption: string) => void;
}

const Feed: React.FC<FeedProps> = ({ userName, userRole, posts, onBook, onViewSchedules, onSearch, onCreatePost }) => {
  const [aiTip, setAiTip] = useState<string>("Carregando sua dica de ouro...");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newCaption, setNewCaption] = useState('');

  const isInstructor = userRole === 'instructor';

  const fetchNewTip = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    const tip = await getInstructorAdvice(isInstructor ? "gestão de aulas e marketing para instrutores" : "direção defensiva e segurança");
    if (tip) {
      const formattedTip = tip.toLowerCase().startsWith("dica") 
        ? tip 
        : `Dica de ouro: ${tip}`;
      setAiTip(formattedTip);
    }
    // Pequeno delay para feedback visual de que atualizou
    setTimeout(() => setIsUpdating(false), 500);
  };

  useEffect(() => {
    fetchNewTip();
    // Aumentado para 2 minutos para evitar erro 429 de quota excedida
    const interval = setInterval(() => {
      fetchNewTip();
    }, 120000);

    return () => clearInterval(interval);
  }, [userRole]);

  const handlePostSubmit = () => {
    if (!newCaption.trim()) return;
    onCreatePost(newCaption);
    setNewCaption('');
    setIsCreatingPost(false);
  };

  return (
    <div className="flex flex-col bg-white dark:bg-slate-950 transition-colors duration-500">
      {/* Welcome Section */}
      <div className="px-6 py-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          Olá, {userName.split(' ')[0]}! <span className="inline-block animate-bounce">👋</span>
        </h2>
        <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
          {isInstructor ? "Pronto para gerenciar suas aulas?" : "Pronto para a sua próxima aula prática?"}
        </p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-2 gap-4 px-5 py-4">
        {isInstructor ? (
          <button 
            onClick={() => setIsCreatingPost(true)}
            className="bg-indigo-600 rounded-[2.5rem] p-6 text-left shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20 hover:bg-indigo-700 transition-all flex flex-col justify-between h-44 group overflow-hidden relative"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform relative z-10">
              <PlusSquare className="text-white" size={24} />
            </div>
            <span className="text-white font-bold text-xl leading-tight tracking-tight relative z-10">Nova<br/>Publicação</span>
          </button>
        ) : (
          <button 
            onClick={onSearch}
            className="bg-blue-600 rounded-[2.5rem] p-6 text-left shadow-lg shadow-blue-100 dark:shadow-blue-900/20 hover:bg-blue-700 transition-all flex flex-col justify-between h-44 group overflow-hidden relative"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform relative z-10">
              <Search className="text-white" size={24} />
            </div>
            <span className="text-white font-bold text-xl leading-tight tracking-tight relative z-10">Buscar<br/>Instrutor</span>
          </button>
        )}
        
        <button 
          onClick={onViewSchedules}
          className="bg-blue-600 rounded-[2.5rem] p-6 text-left shadow-lg shadow-blue-100 dark:shadow-blue-900/20 hover:bg-blue-700 transition-all flex flex-col justify-between h-44 group overflow-hidden relative"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform relative z-10">
            <Calendar className="text-white" size={24} />
          </div>
          <span className="text-white font-bold text-xl leading-tight tracking-tight relative z-10">Minhas<br/>Aulas</span>
        </button>
      </div>

      {/* AI Tip Section */}
      <div className="px-5 py-2">
        <div className={`bg-blue-50/50 dark:bg-slate-900 rounded-[2rem] p-6 border border-blue-100/50 dark:border-slate-800 transition-all duration-500 relative group ${isUpdating ? 'opacity-60' : 'opacity-100'}`}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/20">
              <Layers size={18} />
            </div>
            <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 tracking-widest uppercase">
              {isInstructor ? "Dica de Sucesso IA" : "Dica Prático IA"}
            </span>
            <button 
              onClick={fetchNewTip}
              className={`ml-auto p-1.5 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-indigo-400 transition-all ${isUpdating ? 'animate-spin' : ''}`}
              title="Nova dica"
            >
              <RefreshCw size={14} />
            </button>
          </div>
          <p className="text-[#1a237e] dark:text-indigo-100 font-bold text-base leading-relaxed">
            "{aiTip}"
          </p>
        </div>
      </div>

      {/* Feed List */}
      <div className="mt-8 mb-4 border-t border-gray-100 dark:border-slate-900 pt-6 px-6">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white">
          {isInstructor ? "Minhas Publicações" : "Novidades para você"}
        </h3>
      </div>

      <div className="flex flex-col gap-8 bg-white dark:bg-slate-950 pb-10 transition-colors duration-500">
        {posts.map((post) => (
          <div key={post.id} className="bg-white dark:bg-slate-950">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <img src={post.instructorAvatar} alt={post.instructorName} className="w-9 h-9 rounded-full object-cover border border-gray-100 dark:border-slate-800" />
                <span className="font-bold text-sm tracking-tight dark:text-gray-200">{post.instructorName}</span>
              </div>
              <button className="text-gray-400 p-1">
                <MoreHorizontal size={20} />
              </button>
            </div>

            <div className="w-full bg-gray-100 dark:bg-slate-900 overflow-hidden px-4">
              <img 
                src={post.imageUrl} 
                alt="Post content" 
                className="w-full aspect-[4/5] object-cover rounded-3xl shadow-sm"
                loading="lazy"
              />
            </div>

            <div className="p-6">
              <div className="text-sm text-center px-4 leading-relaxed mb-4">
                <p className="text-gray-800 dark:text-gray-300">
                  {post.caption}
                </p>
              </div>
              
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4 text-center">
                {post.timestamp} ATRÁS
              </div>
              
              {!isInstructor && (
                <button 
                  onClick={() => onBook(post.instructorName, post.instructorAvatar)}
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-100 dark:shadow-blue-900/20 active:scale-[0.98]"
                >
                  Agendar Aula
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* New Post Modal */}
      {isCreatingPost && (
        <div className="fixed inset-0 z-[100] bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-end animate-in fade-in duration-300">
          <div className="w-full bg-white dark:bg-slate-900 rounded-t-[2.5rem] p-8 animate-in slide-in-from-bottom-full duration-500">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">Criar Post</h3>
              <button onClick={() => setIsCreatingPost(false)} className="p-2 bg-gray-100 dark:bg-slate-800 rounded-full dark:text-white">
                <X size={20} />
              </button>
            </div>
            <textarea 
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
              placeholder="O que você quer anunciar hoje?"
              className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-3xl p-6 h-40 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all resize-none text-gray-700 dark:text-gray-200 font-medium placeholder:text-gray-400"
            />
            <button 
              onClick={handlePostSubmit}
              disabled={!newCaption.trim()}
              className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black text-lg mt-6 shadow-xl shadow-blue-100 dark:shadow-blue-900/40 active:scale-95 transition-all disabled:bg-gray-200 dark:disabled:bg-slate-800"
            >
              Publicar Agora
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
