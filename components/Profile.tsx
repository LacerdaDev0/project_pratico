
import React, { useState } from 'react';
// Added Clock to the imports from lucide-react
import { Settings, LogOut, MessageSquare, Shield, HelpCircle, ChevronRight, Inbox, UserCog, CarFront, X, Save, Lock, Clock, User as UserIcon, Palette, Hash, Calendar, TextQuote, History, CheckCircle2, Sparkles, ArrowRight, Wallet, CreditCard, Banknote, FileText, Phone, MessageCircle, MapPin, Fingerprint } from 'lucide-react';
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
  const isCredentialed = user.isCredentialed;
  
  // Mock Autoescola Data for Credentialed Students
  const autoescolaInfo = {
    name: "Autoescola Piloto",
    address: "Av. Principal, 123 - Centro, João Pessoa - PB",
    phone: "(83) 3221-0000",
    whatsapp: "5583988887777"
  };

  const roleLabel = isInstructor 
    ? 'Instrutor Prático' 
    : isCredentialed 
      ? `ALUNO - ${autoescolaInfo.name.toUpperCase()}` 
      : 'Aluno Prático';

  // Modal States
  const [activeModal, setActiveModal] = useState<'profile' | 'vehicle' | 'payment' | 'financial' | 'contract' | null>(null);

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

  const handleSaveProfile = () => {
    setActiveModal(null);
  };

  const settingsItems = [
    // Conditionally show Profile Settings only if NOT credentialed
    ...(!isCredentialed ? [{ 
      icon: UserCog, 
      label: 'Configurações de Perfil', 
      color: 'text-indigo-500', 
      action: () => setActiveModal('profile') 
    }] : []),
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
    <div className="flex flex-col gap-6 bg-white dark:bg-slate-950 min-h-full transition-colors duration-500 pb-20">
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
        
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="flex items-center gap-1.5">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{editName}</h2>
            {isInstructor && <CheckCircle2 size={20} className="text-blue-500" fill="currentColor" />}
          </div>
          
          {isCredentialed && (
             <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">
                <Fingerprint size={12} className="text-blue-600" />
                CPF: {user.cpf ? `${user.cpf.slice(0, 3)}.***.***-${user.cpf.slice(-2)}` : '***.***.***-**'}
             </div>
          )}

          <p className="text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2 bg-slate-50 dark:bg-slate-900 px-4 py-1.5 rounded-full border border-slate-100 dark:border-slate-800">
            {roleLabel}
          </p>
        </div>
        
        {isInstructor && editBio && (
          <p className="mt-4 text-center text-gray-600 dark:text-gray-400 text-xs font-medium leading-relaxed max-w-[280px] animate-in fade-in duration-500">
            {editBio}
          </p>
        )}
      </div>

      {/* Seção Exclusiva Aluno Credenciado */}
      {isCredentialed && (
        <div className="px-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setActiveModal('financial')}
              className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center gap-3 active:scale-95 transition-all text-center"
            >
              <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center text-amber-600">
                <Banknote size={24} />
              </div>
              <div>
                <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Financeiro</span>
                <span className="text-[11px] font-black text-slate-700 dark:text-slate-300">02/10 Parcelas</span>
              </div>
            </button>
            <button 
              onClick={() => setActiveModal('contract')}
              className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center gap-3 active:scale-95 transition-all text-center"
            >
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600">
                <FileText size={24} />
              </div>
              <div>
                <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Contrato</span>
                <span className="text-[11px] font-black text-slate-700 dark:text-slate-300">Ver Documento</span>
              </div>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                <MapPin size={16} />
              </div>
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Minha Unidade</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-black text-slate-700 dark:text-slate-200">{autoescolaInfo.name}</h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed mt-1">
                  {autoescolaInfo.address}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <a 
                  href={`tel:${autoescolaInfo.phone}`}
                  className="flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest border border-slate-100 dark:border-slate-700 active:scale-95 transition-all"
                >
                  <Phone size={14} className="text-blue-600" /> Ligar
                </a>
                <a 
                  href={`https://wa.me/${autoescolaInfo.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-50 dark:bg-green-900/20 p-3 rounded-2xl text-[10px] font-black text-green-600 dark:text-green-400 uppercase tracking-widest border border-green-100 dark:border-green-900/50 active:scale-95 transition-all"
                >
                  <MessageCircle size={14} /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Configurações Gerais */}
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

      {/* Modals Section */}
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

      {activeModal === 'financial' && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-end animate-in fade-in duration-300">
          <div className="w-full bg-white dark:bg-slate-950 rounded-t-[3rem] p-8 animate-in slide-in-from-bottom-full duration-500 shadow-2xl">
             <div className="flex justify-between items-center mb-8">
                <div className="flex flex-col">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Extrato Financeiro</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Autoescola Piloto</p>
                </div>
                <button onClick={() => setActiveModal(null)} className="p-2.5 bg-gray-100 dark:bg-slate-800 rounded-full text-gray-500 hover:rotate-90 transition-transform"><X size={20} /></button>
             </div>

             <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-[2rem] mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Geral</span>
                  <span className="text-xs font-black text-amber-600">PENDENTE</span>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Faltam</span>
                    <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">R$ 1.250,00</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Parcelas</span>
                    <span className="text-lg font-black text-slate-700 dark:text-slate-300">08 / 10</span>
                  </div>
                </div>
             </div>

             <div className="space-y-3 max-h-[30vh] overflow-y-auto pr-2 hide-scrollbar">
                {[
                  { month: 'Março', status: 'paid', val: '156,25' },
                  { month: 'Abril', status: 'paid', val: '156,25' },
                  { month: 'Maio', status: 'pending', val: '156,25' },
                  { month: 'Junho', status: 'upcoming', val: '156,25' },
                ].map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${p.status === 'paid' ? 'bg-green-50 text-green-500' : 'bg-slate-50 text-slate-300'}`}>
                        {p.status === 'paid' ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                      </div>
                      <span className="text-sm font-black text-slate-700 dark:text-slate-200">{p.month}</span>
                    </div>
                    <span className={`text-sm font-black ${p.status === 'paid' ? 'text-slate-400' : 'text-blue-600'}`}>R$ {p.val}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      )}

      {activeModal === 'contract' && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-end animate-in fade-in duration-300">
          <div className="w-full bg-white dark:bg-slate-950 rounded-t-[3rem] p-8 animate-in slide-in-from-bottom-full duration-500 shadow-2xl h-[80vh] flex flex-col">
             <div className="flex justify-between items-center mb-8">
                <div className="flex flex-col">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Contrato de Prestação</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Documento Digital #4281</p>
                </div>
                <button onClick={() => setActiveModal(null)} className="p-2.5 bg-gray-100 dark:bg-slate-800 rounded-full text-gray-500 hover:rotate-90 transition-transform"><X size={20} /></button>
             </div>

             <div className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-[2rem] p-6 overflow-y-auto border border-gray-100 dark:border-slate-800">
                <div className="space-y-6 text-slate-600 dark:text-slate-400 text-xs font-medium leading-relaxed">
                   <p className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-center">Cláusula 1ª - Do Objeto</p>
                   <p>O presente contrato tem por objeto a prestação de serviços de ensino teórico e prático de direção veicular, visando a obtenção da Carteira Nacional de Habilitação (CNH), categoria B.</p>
                   
                   <p className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-center">Cláusula 2ª - Dos Valores</p>
                   <p>O contratante pagará à contratada o valor total de R$ 1.562,50 divididos em 10 parcelas mensais fixas.</p>

                   <p className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-center">Cláusula 3ª - Das Obrigações</p>
                   <p>A autoescola Piloto compromete-se a fornecer instrutores credenciados e veículos em plenas condições de uso e segurança.</p>
                   
                   <p className="text-center italic pt-4">Assinado digitalmente em: 10/03/2024</p>
                </div>
             </div>

             <button className="w-full mt-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3">
               <FileText size={18} /> Baixar PDF
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
