
import React from 'react';
import { MessageSquare, ChevronRight, Inbox } from 'lucide-react';
import { ChatThread, UserRole } from '../types';

interface ChatListProps {
  threads: ChatThread[];
  onOpenChat: (id: string) => void;
  userRole: UserRole;
}

const ChatList: React.FC<ChatListProps> = ({ threads, onOpenChat, userRole }) => {
  const isInstructor = userRole === 'instructor';
  
  // Filtra para mostrar apenas conversas que já tiveram pelo menos uma mensagem
  const activeThreads = threads.filter(t => t.messages.length > 0);

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6">
        <h2 className="text-2xl font-black text-gray-900 mb-2">Mensagens</h2>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
          {isInstructor ? 'Suas conversas com alunos' : 'Suas conversas com instrutores'}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-20">
        {activeThreads.length > 0 ? (
          <div className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm mb-10">
            {activeThreads.map((chat) => (
              <button 
                key={chat.id}
                onClick={() => onOpenChat(chat.id)}
                className="w-full flex items-center gap-4 p-5 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="relative">
                  <img src={chat.participantAvatar} alt={chat.participantName} className="w-14 h-14 rounded-2xl object-cover shadow-sm" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-black text-gray-900 text-sm tracking-tight">{chat.participantName}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                      {chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].timestamp : ''}
                    </span>
                  </div>
                  <p className={`text-xs truncate max-w-[180px] ${chat.unreadCount > 0 ? 'text-gray-900 font-bold' : 'text-gray-500 font-medium'}`}>
                    {chat.lastMessage || 'Inicie a conversa...'}
                  </p>
                </div>

                {chat.unreadCount > 0 && (
                  <div className="bg-blue-600 text-white w-6 h-6 rounded-xl flex items-center justify-center text-[10px] font-black shadow-lg shadow-blue-200">
                    {chat.unreadCount}
                  </div>
                )}
                <ChevronRight size={18} className="text-gray-200 ml-1" />
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 opacity-30">
            <Inbox size={48} className="text-gray-300 mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Nenhuma conversa encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
