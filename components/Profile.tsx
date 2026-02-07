
import React from 'react';
import { Settings, LogOut, MessageSquare, Shield, HelpCircle, ChevronRight, Inbox } from 'lucide-react';
import { ChatThread, User } from '../types';

interface ProfileProps {
  user: User;
  threads: ChatThread[];
  onOpenChat: (id: string) => void;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, threads, onOpenChat, onLogout }) => {
  const isInstructor = user.role === 'instructor';
  const roleLabel = isInstructor ? 'Instrutor' : 'Aluno';

  return (
    <div className="flex flex-col gap-6 bg-white dark:bg-slate-950 min-h-full transition-colors duration-500">
      {/* Profile Header */}
      <div className="bg-white dark:bg-slate-950 p-6 flex flex-col items-center border-b border-gray-100 dark:border-slate-900">
        <div className="relative mb-4">
          <img 
            src={`https://picsum.photos/seed/${user.id}/200/200`} 
            alt="My Profile" 
            className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-900 shadow-xl object-cover"
          />
          <div className="absolute bottom-0 right-0 bg-blue-600 p-1.5 rounded-full border-2 border-white dark:border-slate-900 shadow-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{roleLabel} Prático</p>
        
        {isInstructor && (
          <div className="flex gap-4 mt-6 w-full animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="flex-1 bg-blue-50 dark:bg-blue-900/10 p-3 rounded-2xl text-center border border-blue-100/50 dark:border-blue-900/20">
              <span className="block text-blue-600 dark:text-blue-400 font-black text-lg">42</span>
              <span className="text-[9px] text-blue-500 dark:text-blue-500 font-bold uppercase tracking-wider">Aulas</span>
            </div>
            <div className="flex-1 bg-green-50 dark:bg-green-900/10 p-3 rounded-2xl text-center border border-green-100/50 dark:border-green-900/20">
              <span className="block text-green-600 dark:text-green-400 font-black text-lg">4.9</span>
              <span className="text-[9px] text-green-500 dark:text-green-500 font-bold uppercase tracking-wider">Nota</span>
            </div>
            <div className="flex-1 bg-purple-50 dark:bg-purple-900/10 p-3 rounded-2xl text-center border border-purple-100/50 dark:border-purple-900/20">
              <span className="block text-purple-600 dark:text-purple-400 font-black text-lg">2a</span>
              <span className="text-[9px] text-purple-500 dark:text-purple-500 font-bold uppercase tracking-wider">Tempo</span>
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="px-4">
        <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <MessageSquare size={18} className="text-blue-500" />
          Conversas Recentes
        </h3>
        {threads.length > 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-800 shadow-sm">
            {threads.slice(0, 3).map((chat) => (
              <button 
                key={chat.id}
                onClick={() => onOpenChat(chat.id)}
                className="w-full flex items-center gap-4 p-4 border-b border-gray-50 dark:border-slate-800 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                <img src={chat.participantAvatar} alt={chat.participantName} className="w-12 h-12 rounded-full object-cover" />
                <div className="flex-1 text-left">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-gray-900 dark:text-gray-200">{chat.participantName}</span>
                    <span className="text-[10px] text-gray-400">Recente</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">{chat.lastMessage || 'Inicie a conversa...'}</p>
                </div>
                {chat.unreadCount > 0 && (
                  <div className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">
                    {chat.unreadCount}
                  </div>
                )}
                <ChevronRight size={16} className="text-gray-300 dark:text-gray-600" />
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50/50 dark:bg-slate-900 rounded-2xl p-8 flex flex-col items-center justify-center border border-dashed border-gray-200 dark:border-slate-800">
            <Inbox size={24} className="text-gray-300 dark:text-gray-700 mb-2" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600">Nenhum chat iniciado</p>
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="px-4 pb-10">
        <h3 className="font-bold text-gray-900 dark:text-white mb-3">Configurações</h3>
        <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col">
          {[
            { icon: Shield, label: 'Segurança', color: 'text-blue-500', action: () => {} },
            { icon: Settings, label: 'Preferências da Conta', color: 'text-gray-500 dark:text-gray-400', action: () => {} },
            { icon: HelpCircle, label: 'Ajuda e Suporte', color: 'text-green-500', action: () => {} },
            { icon: LogOut, label: 'Sair da Conta', color: 'text-red-500', action: onLogout }
          ].map((item, idx) => (
            <button 
              key={idx}
              onClick={item.action}
              className="flex items-center gap-4 p-4 border-b border-gray-50 dark:border-slate-800 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
            >
              <item.icon size={20} className={item.color} />
              <span className={`text-sm font-medium ${item.color.includes('red') ? 'text-red-500' : 'text-gray-700 dark:text-gray-200'}`}>
                {item.label}
              </span>
              <ChevronRight size={16} className="ml-auto text-gray-300 dark:text-gray-600" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;