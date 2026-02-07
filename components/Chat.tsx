
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Phone, Video, Info } from 'lucide-react';
import { Message, ChatThread } from '../types';

interface ChatProps {
  thread: ChatThread;
  onSendMessage: (text: string) => void;
  onBack: () => void;
  onViewProfile?: () => void;
  draftMessage?: string | null;
  showQuickActions?: boolean;
}

const Chat: React.FC<ChatProps> = ({ thread, onSendMessage, onBack, onViewProfile, draftMessage, showQuickActions }) => {
  const [inputText, setInputText] = useState('');
  const [quickActionsVisible, setQuickActionsVisible] = useState(showQuickActions);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sincroniza o scroll para o fim da conversa
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [thread.messages]);

  // Atualiza visibilidade das ações rápidas baseada na prop
  useEffect(() => {
    setQuickActionsVisible(showQuickActions);
  }, [showQuickActions]);

  // Gerencia o rascunho da mensagem (draftMessage)
  useEffect(() => {
    if (draftMessage) {
      setInputText(draftMessage);
    } else if (draftMessage === null && inputText === '') {
      // Só limpa se o input estiver realmente vazio para evitar perder o que o usuário já digitou
      setInputText('');
    }
  }, [draftMessage, thread.id]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
    setQuickActionsVisible(false);
  };

  const handleQuickAction = (text: string) => {
    setInputText(text);
  };

  const quickActions = [
    { label: 'Agendar aula', text: 'Olá! Gostaria de agendar uma aula prática com você.' },
    { label: 'Disponibilidade', text: 'Olá! Você tem horários disponíveis para esta semana?' },
    { label: 'Qual categoria?', text: 'Olá! Quais categorias de CNH você atende?' }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 relative z-50 animate-in slide-in-from-right-full duration-500">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={onViewProfile}
          >
            <img 
              src={thread.participantAvatar} 
              alt="Avatar" 
              className="w-10 h-10 rounded-full border border-gray-100 object-cover group-hover:opacity-80 transition-opacity" 
            />
            <div>
              <h4 className="font-bold text-sm text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                {thread.participantName}
              </h4>
              <span className="text-[10px] text-green-500 font-bold uppercase tracking-tighter flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> Online
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-4 text-blue-600">
          <Phone size={20} className="cursor-pointer" />
          <Video size={20} className="cursor-pointer" />
        </div>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4">
        {thread.messages.length > 0 ? thread.messages.map((msg) => {
          const isUser = msg.senderId === 'user';
          return (
            <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm shadow-sm ${
                isUser 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
              }`}>
                {msg.text}
                <div className={`text-[10px] mt-1 text-right ${isUser ? 'text-blue-200' : 'text-gray-400'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="flex items-center justify-center h-full opacity-20">
             <p className="text-xs font-black uppercase tracking-widest text-center">Inicie sua conversa com<br/>{thread.participantName}</p>
          </div>
        )}
      </div>

      {/* Footer Area with Quick Actions */}
      <div className="bg-white border-t border-gray-100 pb-20 pt-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {quickActionsVisible && (
          <div className="px-4 pb-3 flex gap-2 overflow-x-auto hide-scrollbar animate-in slide-in-from-bottom-2 duration-300">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action.text)}
                className="whitespace-nowrap bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-bold py-2.5 px-5 rounded-full border border-gray-200 transition-all active:scale-95"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
        
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-100 shadow-inner focus-within:border-blue-200 transition-colors">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Digite sua mensagem..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-2 text-gray-800 placeholder-gray-400 font-medium h-10"
            />
            <button 
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className={`p-2.5 rounded-xl transition-all shadow-sm ${
                inputText.trim() ? 'bg-blue-600 text-white scale-100 active:scale-90' : 'bg-gray-200 text-gray-400 scale-95 opacity-50'
              }`}
            >
              <Send size={20} fill={inputText.trim() ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
