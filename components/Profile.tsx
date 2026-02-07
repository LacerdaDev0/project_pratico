
import React, { useState } from 'react';
import { Settings, LogOut, MessageSquare, Shield, HelpCircle, ChevronRight, Inbox, UserCog, CarFront, X, Save, Lock, User as UserIcon, Palette, Hash, Calendar, TextQuote, History, CheckCircle2, Sparkles, ArrowRight, Wallet, CreditCard, Banknote } from 'lucide-react';
import { ChatThread, User, VehicleInfo } from '../types';

interface ProfileProps {
  user: User;
  threads: ChatThread[];
  onOpenChat: (id: string) => void;
  onLogout: () => void;
  onManageKey: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, threads, onOpenChat, onLogout, onManageKey }) => {
  const isInstructor = user.role === 'instructor';
  const roleLabel = isInstructor ? 'Instrutor Prático' : 'Aluno Prático';

  // Modal States
  const [activeModal, setActiveModal] = useState<'profile' | 'vehicle' | 'payment' | null>(null);

  // Edit Profile States
  const [editName, setEditName] = useState(user.name);
  const [editPassword, setEditPassword] = useState('');
  const [editBio, setEditBio] = useState(user.bio || 'Instrutor dedicado a ajudar alunos a conquistarem sua independência no volante.');

  // Edit Vehicle States
  const [vehicle, setVehicle] = useState<VehicleInfo>(user.vehicle || {
    type: 'car',
    model: 'Toyota Corolla',
    color: 'Prata',
    plate: 'BRA2E19',
    year: '2022'
  });

  // Payment Setup States
  const [paymentType, setPaymentType] = useState<'pix' | 'bank'>('pix');
  const [pixKeyType, setPixKeyType] = useState('cpf');
  const [pixKey, setPixKey] = useState('');
  const [bankName, setBankName] = useState('');
  const [agency, setAgency] = useState('');
  const [account, setAccount] = useState('');

  const handleSaveProfile = () => {
    setActiveModal(null);
  };

  const handleSaveVehicle = () => {
    setActiveModal(null);
  };

  const handleSavePayment = () => {
    setActiveModal(null);
  };

  const settingsItems = [
    { 
      icon: UserCog, 
      label: 'Configurações de Perfil', 
      color: 'text-indigo-500', 
      action: () => setActiveModal('profile') 
    },
    ...(isInstructor ? [
      { 
        icon: CarFront, 
        label: 'Dados do Veículo', 
        color: 'text-blue-500', 
        action: () => setActiveModal('vehicle') 
      },
      { 
        icon: Wallet, 
        label: 'Dados de Recebimento', 
        color: 'text-amber-500', 
        action: () => setActiveModal('payment') 
      }
    ] : []),
    { 
      icon: Shield, 
      label: 'Segurança e Privacidade', 
      color: 'text-slate-400 dark:text-slate-500', 
      action: () => {} 
    },
    { 
      icon: Settings, 
      label: 'Preferências da Conta', 
      color: 'text-gray-400', 
      action: () => {} 
    },
    { 
      icon: HelpCircle, 
      label: 'Ajuda e Suporte', 
      color: 'text-emerald-500', 
      action: () => {} 
    },
    { 
      icon: LogOut, 
      label: 'Sair da Conta', 
      color: 'text-rose-500', 
      action: onLogout 
    }
  ];

  return (
    <div className="flex flex-col gap-6 bg-white dark:bg-slate-950 min-h-full transition-colors duration-500">
      {/* Profile Header */}
      <div className="bg-white dark:bg-slate-950 p-8 flex flex-col items-center border-b border-gray-100 dark:border-slate-900">
        <div className="relative mb-5">
          <div className="w-[110px] h-[110px] rounded-full p-[3px] bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 shadow-2xl">
             <div className="w-full h-full rounded-full border-4 border-white dark:border-slate-900 overflow-hidden bg-gray-100">
                <img 
                  src={`https://picsum.photos/seed/${user.id}/200/200`} 
                  alt="My Profile" 
                  className="w-full h-full object-cover"
                />
             </div>
          </div>
          <div className="absolute bottom-1 right-2 bg-blue-600 p-2 rounded-full border-4 border-white dark:border-slate-900 shadow-lg">
            <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{editName}</h2>
          {isInstructor && <CheckCircle2 size={20} className="text-blue-500" fill="currentColor" />}
        </div>
        
        <p className="text-gray-400 dark:text-gray-500 text-[11px] font-black uppercase tracking-[0.3em] mt-1">
          {roleLabel}
        </p>
        
        {/* Bio only for instructor */}
        {isInstructor && editBio && (
          <p className="mt-4 text-center text-gray-600 dark:text-gray-400 text-xs font-medium leading-relaxed max-w-[280px] animate-in fade-in duration-500">
            {editBio}
          </p>
        )}

        {isInstructor && (
          <div className="flex gap-3 mt-6 w-full animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="flex-1 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-[1.5rem] text-center border border-blue-100/50 dark:border-blue-900/20">
              <span className="block text-blue-600 dark:text-blue-400 font-black text-xl">42</span>
              <span className="text-[8px] text-blue-500 dark:text-blue-500 font-black uppercase tracking-[0.1em]">Aulas</span>
            </div>
            <div className="flex-1 bg-green-50 dark:bg-green-900/10 p-4 rounded-[1.5rem] text-center border border-green-100/50 dark:border-green-900/20">
              <span className="block text-green-600 dark:text-green-400 font-black text-xl">4.9</span>
              <span className="text-[8px] text-green-500 dark:text-green-500 font-black uppercase tracking-[0.1em]">Nota</span>
            </div>
            <div className="flex-1 bg-purple-50 dark:bg-purple-900/10 p-4 rounded-[1.5rem] text-center border border-purple-100/50 dark:border-purple-900/20">
              <span className="block text-purple-600 dark:text-purple-400 font-black text-xl">2a</span>
              <span className="text-[8px] text-purple-500 dark:text-purple-500 font-black uppercase tracking-[0.1em]">Tempo</span>
            </div>
          </div>
        )}
      </div>

      {isInstructor && (
        <div className="px-4">
          <div className="bg-gradient-to-br from-blue-700 via-indigo-600 to-purple-700 rounded-[2.5rem] p-7 shadow-2xl shadow-blue-200/50 dark:shadow-none relative overflow-hidden group cursor-pointer" onClick={() => setActiveModal('profile')}>
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
              <Sparkles size={120} />
            </div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/30 shadow-inner">
                  <CheckCircle2 size={28} strokeWidth={2.5} />
                </div>
                <div>
                   <h4 className="text-white font-black text-lg tracking-tight">GANHE SEU SELO</h4>
                   <p className="text-blue-100 text-[9px] font-black uppercase tracking-[0.2em] opacity-80">Credibilidade Prático</p>
                </div>
              </div>
              <p className="text-blue-100 text-[13px] font-bold leading-relaxed mb-6">
                Conclua todo o seu perfil e seu perfil vai ser verificado, aumentando sua chance para alunos e transmitindo mais confiança!
              </p>
              <div className="flex flex-col gap-3">
                <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden border border-white/10 shadow-inner">
                  <div className="w-[85%] h-full bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-[10px] text-white font-black uppercase tracking-[0.2em]">85% CONCLUÍDO</span>
                  <div className="bg-white text-blue-700 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 active:scale-95 transition-all shadow-xl">
                    CONCLUIR PERFIL <ArrowRight size={14} strokeWidth={3} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Chats Section */}
      <div className="px-4">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2 flex items-center gap-2">
          <MessageSquare size={14} className="text-blue-500" />
          Conversas Recentes
        </h3>
        {threads.length > 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-slate-800 shadow-sm">
            {threads.slice(0, 3).map((chat) => (
              <button 
                key={chat.id}
                onClick={() => onOpenChat(chat.id)}
                className="w-full flex items-center gap-4 p-5 border-b border-gray-50 dark:border-slate-800 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-left"
              >
                <img src={chat.participantAvatar} alt={chat.participantName} className="w-12 h-12 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="font-bold text-sm text-gray-900 dark:text-gray-200">{chat.participantName}</span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase">Agora</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px] font-medium">{chat.lastMessage || 'Inicie a conversa...'}</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 dark:text-gray-600" />
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50/50 dark:bg-slate-900 rounded-[2rem] p-10 flex flex-col items-center justify-center border border-dashed border-gray-200 dark:border-slate-800">
            <Inbox size={32} className="text-gray-200 dark:text-gray-700 mb-3" />
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 dark:text-gray-600 text-center">Nenhum chat ativo no momento</p>
          </div>
        )}
      </div>

      {/* Settings Section */}
      <div className="px-4 pb-12">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">Suas Configurações</h3>
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col">
          {settingsItems.map((item, idx) => (
            <button 
              key={idx}
              onClick={item.action}
              className="flex items-center gap-4 p-5 border-b border-gray-50 dark:border-slate-800 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-left"
            >
              <div className={`p-2 rounded-xl bg-gray-50 dark:bg-slate-800 group-hover:scale-110 transition-transform ${item.color}`}>
                <item.icon size={18} />
              </div>
              <span className={`text-sm font-bold flex-1 ${item.color.includes('rose') ? 'text-rose-500' : 'text-gray-700 dark:text-gray-200'}`}>
                {item.label}
              </span>
              <ChevronRight size={16} className="text-gray-200 dark:text-gray-700" />
            </button>
          ))}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {activeModal === 'profile' && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-end animate-in fade-in duration-300">
          <div className="w-full bg-white dark:bg-slate-950 rounded-t-[3rem] p-8 animate-in slide-in-from-bottom-full duration-500 max-h-[95vh] overflow-y-auto hide-scrollbar shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <div className="flex flex-col">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Editar Perfil</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Informações Pessoais</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2.5 bg-gray-100 dark:bg-slate-800 rounded-full text-gray-500 hover:rotate-90 transition-transform"><X size={20} /></button>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome Completo</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-900 rounded-2xl pl-12 pr-6 py-4 border-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 text-sm font-bold text-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {isInstructor && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sua Biografia Profissional</label>
                  <div className="relative">
                    <TextQuote className="absolute left-4 top-4 text-gray-300" size={18} />
                    <textarea 
                      rows={3}
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-slate-900 rounded-2xl pl-12 pr-6 py-4 border-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 text-sm font-bold text-gray-700 dark:text-white resize-none"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Alterar Senha</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input 
                    type="password" 
                    placeholder="Deixe em branco para manter"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-900 rounded-2xl pl-12 pr-6 py-4 border-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 text-sm font-bold text-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={handleSaveProfile}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-blue-100 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <Save size={18} /> Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Vehicle Modal */}
      {activeModal === 'vehicle' && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-end animate-in fade-in duration-300">
          <div className="w-full bg-white dark:bg-slate-950 rounded-t-[3rem] p-8 animate-in slide-in-from-bottom-full duration-500 max-h-[95vh] overflow-y-auto hide-scrollbar shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <div className="flex flex-col">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Configurar Veículo</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Atuação e Equipamento</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2.5 bg-gray-100 dark:bg-slate-800 rounded-full text-gray-500 hover:rotate-90 transition-transform"><X size={20} /></button>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tipo de Veículo Principal</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['car', 'moto', 'both'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setVehicle({ ...vehicle, type: t })}
                      className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-wider transition-all border-2 ${
                        vehicle.type === t 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' 
                          : 'bg-gray-50 dark:bg-slate-900 border-transparent text-gray-400'
                      }`}
                    >
                      {t === 'car' ? 'Carro' : t === 'moto' ? 'Moto' : 'Ambos'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Modelo / Marca do Veículo</label>
                <div className="relative">
                  <CarFront className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input 
                    type="text" 
                    placeholder="Ex: Honda Civic ou Yamaha MT-03"
                    value={vehicle.model}
                    onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-slate-900 rounded-2xl pl-12 pr-6 py-4 border-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 text-sm font-bold text-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cor</label>
                  <div className="relative">
                    <Palette className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      type="text" 
                      placeholder="Ex: Branco"
                      value={vehicle.color}
                      onChange={(e) => setVehicle({ ...vehicle, color: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-slate-900 rounded-2xl pl-12 pr-6 py-4 border-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 text-sm font-bold text-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ano</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      type="text" 
                      placeholder="2024"
                      value={vehicle.year}
                      onChange={(e) => setVehicle({ ...vehicle, year: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-slate-900 rounded-2xl pl-12 pr-6 py-4 border-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 text-sm font-bold text-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Placa Oficial</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input 
                    type="text" 
                    placeholder="PRT-2025"
                    value={vehicle.plate}
                    onChange={(e) => setVehicle({ ...vehicle, plate: e.target.value.toUpperCase() })}
                    className="w-full bg-gray-50 dark:bg-slate-900 rounded-2xl pl-12 pr-6 py-4 border-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 text-sm font-bold text-gray-700 dark:text-white uppercase tracking-widest"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={handleSaveVehicle}
                  className="w-full bg-gradient-to-r from-blue-700 to-indigo-600 text-white py-5.5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-blue-200/40 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <Save size={18} /> Atualizar Veículo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Payment Modal */}
      {activeModal === 'payment' && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-end animate-in fade-in duration-300">
          <div className="w-full bg-white dark:bg-slate-950 rounded-t-[3rem] p-8 animate-in slide-in-from-bottom-full duration-500 max-h-[95vh] overflow-y-auto hide-scrollbar shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <div className="flex flex-col">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Dados de Recebimento</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Configurar Saques</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2.5 bg-gray-100 dark:bg-slate-800 rounded-full text-gray-500 hover:rotate-90 transition-transform"><X size={20} /></button>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Método de Preferência</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['pix', 'bank'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setPaymentType(t)}
                      className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-wider transition-all border-2 flex items-center justify-center gap-2 ${
                        paymentType === t 
                          ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-100' 
                          : 'bg-gray-50 dark:bg-slate-900 border-transparent text-gray-400'
                      }`}
                    >
                      {t === 'pix' ? <CheckCircle2 size={14} /> : <CreditCard size={14} />}
                      {t === 'pix' ? 'Pix' : 'Conta Bancária'}
                    </button>
                  ))}
                </div>
              </div>

              {paymentType === 'pix' ? (
                <div className="space-y-5 animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tipo de Chave</label>
                    <select 
                      value={pixKeyType}
                      onChange={(e) => setPixKeyType(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-slate-900 rounded-2xl px-6 py-4 border-none focus:ring-2 focus:ring-amber-100 text-sm font-bold text-gray-700 dark:text-white appearance-none"
                    >
                      <option value="cpf">CPF</option>
                      <option value="email">E-mail</option>
                      <option value="phone">Celular</option>
                      <option value="random">Chave Aleatória</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Chave Pix</label>
                    <div className="relative">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input 
                        type="text" 
                        placeholder="Insira sua chave aqui"
                        value={pixKey}
                        onChange={(e) => setPixKey(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-slate-900 rounded-2xl pl-12 pr-6 py-4 border-none focus:ring-2 focus:ring-amber-100 text-sm font-bold text-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-5 animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Banco</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Nubank, Itaú..."
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-slate-900 rounded-2xl px-6 py-4 border-none focus:ring-2 focus:ring-amber-100 text-sm font-bold text-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Agência</label>
                      <input 
                        type="text" 
                        placeholder="0001"
                        value={agency}
                        onChange={(e) => setAgency(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-slate-900 rounded-2xl px-6 py-4 border-none focus:ring-2 focus:ring-amber-100 text-sm font-bold text-gray-700 dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Conta</label>
                      <input 
                        type="text" 
                        placeholder="12345-6"
                        value={account}
                        onChange={(e) => setAccount(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-slate-900 rounded-2xl px-6 py-4 border-none focus:ring-2 focus:ring-amber-100 text-sm font-bold text-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4">
                <button 
                  onClick={handleSavePayment}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-white py-5.5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-amber-100 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <Save size={18} /> Salvar Dados
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
