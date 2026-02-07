
import React, { useState, useEffect } from 'react';
import { UserRole } from '../types';
import { Wallet, ArrowUpRight, History, Calendar, CheckCircle2, XCircle, TrendingUp, Clock, RefreshCw, PlusSquare, X, ArrowLeft, BarChart3, Target, Landmark, Smartphone, Zap, Loader2 } from 'lucide-react';
import { getInstructorAdvice } from '../services/geminiService';

interface WalletViewProps {
  userName: string;
  onCreatePost: (caption: string) => void;
  onGoToProfile: () => void;
}

const WalletView: React.FC<WalletViewProps> = ({ userName, onCreatePost, onGoToProfile }) => {
  const [aiTip, setAiTip] = useState<string>("Carregando sua dica de ouro...");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [isViewingStats, setIsViewingStats] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawalStep, setWithdrawalStep] = useState<'amount' | 'processing' | 'success'>('amount');
  const [withdrawAmount, setWithdrawAmount] = useState('1540.25');
  const [newCaption, setNewCaption] = useState('');

  // Simulando se o usuário já tem pix ou banco cadastrado (Definindo como false para exibir a necessidade de verificação)
  const [hasPaymentSetup] = useState(false); 

  const fetchNewTip = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    const tip = await getInstructorAdvice('instructor');
    if (tip) {
      setAiTip(tip.toLowerCase().startsWith("dica") ? tip : `Dica de ouro: ${tip}`);
    }
    setTimeout(() => setIsUpdating(false), 500);
  };

  useEffect(() => {
    fetchNewTip();
  }, []);

  const handlePostSubmit = () => {
    if (!newCaption.trim()) return;
    onCreatePost(newCaption);
    setNewCaption('');
    setIsCreatingPost(false);
  };

  const handleWithdrawAction = () => {
    setWithdrawalStep('processing');
    setTimeout(() => {
      setWithdrawalStep('success');
    }, 2000);
  };

  const closeWithdrawal = () => {
    setIsWithdrawing(false);
    setWithdrawalStep('amount');
  };

  const monthlyHistory = [
    { month: 'Maio', value: 4850.50, lessons: 41, growth: '+15%', status: 'current' },
    { month: 'Abril', value: 4200.00, lessons: 35, growth: '+12%', status: 'past' },
    { month: 'Março', value: 3750.00, lessons: 31, growth: '+5%', status: 'past' },
    { month: 'Fevereiro', value: 3570.00, lessons: 30, growth: '-2%', status: 'past' },
    { month: 'Janeiro', value: 3640.00, lessons: 32, growth: '+8%', status: 'past' },
  ];

  return (
    <div className="flex flex-col bg-slate-50 dark:bg-slate-950 min-h-full pb-24 animate-in fade-in duration-500">
      {/* Header */}
      <div className="px-6 py-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Olá, {userName.split(' ')[0]}!</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Painel do Instrutor</p>
        </div>
      </div>

      {/* Wallet Card */}
      <div className="px-6 mb-8">
        <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 rounded-[2.5rem] p-8 shadow-2xl shadow-blue-200 dark:shadow-none relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <span className="text-blue-100 text-[10px] font-black uppercase tracking-[0.2em]">Saldo Disponível</span>
              <Wallet className="text-white/40" size={20} />
            </div>
            
            <div className="mb-8">
              <span className="text-white font-black text-4xl tracking-tighter">R$ 1.540,25</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setIsWithdrawing(true)}
                className="bg-white text-blue-600 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <ArrowUpRight size={14} strokeWidth={3} /> Sacar
              </button>
              <button className="bg-blue-500/30 backdrop-blur-md text-white border border-white/20 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2">
                <History size={14} strokeWidth={3} /> Extrato
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="px-6 grid grid-cols-2 gap-4 mb-8">
        <button onClick={() => setIsViewingStats(true)} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-2 text-left group active:scale-[0.97] transition-all">
          <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Ganhos (Mês)</span>
          <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 transition-colors">R$ 4.200,00</span>
          <div className="flex items-center gap-1 mt-1">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span className="text-[9px] font-bold text-green-600 uppercase">+12% vs mês anterior</span>
          </div>
        </button>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-2">
          <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Saldo Pendente</span>
          <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">R$ 320,50</span>
          <div className="flex items-center gap-1 mt-1">
            <Clock size={10} className="text-amber-500" />
            <span className="text-[9px] font-bold text-amber-600 uppercase">Libera em 3 dias</span>
          </div>
        </div>
      </div>

      {/* AI Tip Section */}
      <div className="px-6 mb-8">
        <div className={`bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-500 relative group ${isUpdating ? 'opacity-60' : 'opacity-100'}`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <TrendingUp size={12} />
            </div>
            <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 tracking-widest uppercase">Insight Prático IA</span>
            <button onClick={fetchNewTip} className={`ml-auto p-1 text-slate-400 hover:text-indigo-500 transition-all ${isUpdating ? 'animate-spin' : ''}`}><RefreshCw size={14} /></button>
          </div>
          <p className="text-slate-700 dark:text-slate-300 font-bold text-[13px] leading-relaxed italic">"{aiTip}"</p>
        </div>
      </div>

      {/* Performance Grid */}
      <div className="px-6 mb-8">
        <h3 className="font-black text-sm text-slate-900 dark:text-white tracking-widest uppercase mb-6">Visão Geral dos Alunos</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 mb-3"><Calendar size={18} /></div>
            <span className="text-xl font-black text-slate-900 dark:text-white">8</span>
            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter mt-1">Agendados</span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center text-green-600 mb-3"><CheckCircle2 size={18} /></div>
            <span className="text-xl font-black text-slate-900 dark:text-white">124</span>
            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter mt-1">Concluídos</span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center text-red-600 mb-3"><XCircle size={18} /></div>
            <span className="text-xl font-black text-slate-900 dark:text-white">2</span>
            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter mt-1">Cancelados</span>
          </div>
        </div>
      </div>

      {/* Action Button: Conditional Verification or New Post */}
      <div className="px-6">
        {!hasPaymentSetup ? (
          <button 
            onClick={onGoToProfile}
            className="w-full bg-amber-500 text-white py-5 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-amber-100 dark:shadow-none active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Smartphone size={18} /> Verificar dados de pagamento
          </button>
        ) : (
          <button 
            onClick={() => setIsCreatingPost(true)} 
            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 py-5 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 dark:shadow-none active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <PlusSquare size={18} /> Nova Publicação
          </button>
        )}
      </div>

      {/* Modal stats */}
      {isViewingStats && (
        <div className="fixed inset-0 z-[110] bg-white dark:bg-slate-950 animate-in slide-in-from-right duration-500 overflow-y-auto hide-scrollbar">
          <header className="px-6 py-8 sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md flex items-center z-20">
            <button onClick={() => setIsViewingStats(false)} className="p-3 bg-gray-50 dark:bg-slate-900 rounded-2xl text-slate-900 dark:text-white hover:bg-gray-100 active:scale-90 transition-all shadow-sm">
              <ArrowLeft size={20} strokeWidth={2.5} />
            </button>
            <div className="flex-1 text-center pr-10">
              <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em]">Estatísticas</h3>
            </div>
          </header>
          <div className="px-6 pb-20 space-y-12">
            <div className="flex flex-col items-center py-10 animate-in zoom-in duration-700">
              <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.3em] mb-3">Valor Médio</span>
              <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">R$ 119,70</span>
              <div className="mt-6 flex items-center gap-2 bg-blue-50 dark:bg-blue-900/10 px-4 py-1.5 rounded-full">
                 <Target size={12} className="text-blue-600" />
                 <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Baseado em 428 aulas</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-slate-900/50 p-8 rounded-[2.5rem] flex flex-col items-center text-center">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Anual</span>
                <span className="text-xl font-black text-slate-900 dark:text-white">R$ 51.240</span>
              </div>
              <div className="bg-gray-50 dark:bg-slate-900/50 p-8 rounded-[2.5rem] flex flex-col items-center text-center">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Crescimento</span>
                <span className="text-xl font-black text-green-600">+15.4%</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center px-4 mb-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Histórico Mensal</h4>
                <BarChart3 size={16} className="text-slate-300" />
              </div>
              {monthlyHistory.map((item, idx) => (
                <div key={idx} className={`flex items-center justify-between p-6 rounded-[2rem] transition-all ${item.status === 'current' ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'bg-white dark:bg-slate-900/30 border border-gray-50 dark:border-slate-900'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.status === 'current' ? 'bg-white/20' : 'bg-gray-50 dark:bg-slate-800'}`}>
                      <Calendar size={18} className={item.status === 'current' ? 'text-white' : 'text-slate-400'} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-sm tracking-tight">{item.month}</span>
                      <span className={`text-[9px] font-bold uppercase ${item.status === 'current' ? 'text-blue-100' : 'text-slate-400'}`}>{item.lessons} aulas</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-sm">R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                    <div className={`text-[9px] font-black uppercase ${item.status === 'current' ? 'text-white' : item.growth.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>{item.growth}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Saque Modal (Withdrawal) */}
      {isWithdrawing && (
        <div className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm flex items-end animate-in fade-in duration-300">
          <div className="w-full bg-white dark:bg-slate-950 rounded-t-[3rem] p-10 animate-in slide-in-from-bottom-full duration-500 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
               <Wallet size={120} />
            </div>

            <div className="flex justify-between items-center mb-10">
              <div className="flex flex-col gap-1">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Realizar Saque</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recebimento Prático</p>
              </div>
              <button onClick={closeWithdrawal} className="p-3 bg-gray-50 dark:bg-slate-900 rounded-full text-gray-500 hover:rotate-90 transition-transform shadow-sm"><X size={20} /></button>
            </div>

            {!hasPaymentSetup ? (
              <div className="flex flex-col items-center py-10 text-center animate-in zoom-in duration-500">
                <div className="w-20 h-20 bg-amber-50 dark:bg-amber-900/20 rounded-[2rem] flex items-center justify-center text-amber-500 mb-6 shadow-inner">
                  <Smartphone size={40} />
                </div>
                <h4 className="font-black text-lg text-gray-900 dark:text-white mb-2">Verificar dados de pagamento</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-[280px]">
                  Para realizar saques, você precisa primeiro cadastrar uma chave Pix ou conta bancária em seu perfil.
                </p>
                <button 
                  onClick={() => { closeWithdrawal(); onGoToProfile(); }}
                  className="w-full bg-blue-600 text-white py-5 rounded-[2.5rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-100 active:scale-95 transition-all"
                >
                  Verificar dados de pagamento
                </button>
              </div>
            ) : withdrawalStep === 'amount' ? (
              <div className="animate-in fade-in duration-500">
                <div className="bg-gray-50 dark:bg-slate-900/50 rounded-[2.5rem] p-8 mb-8 border border-gray-100 dark:border-slate-800">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-gray-100 dark:border-slate-700">
                      <Smartphone size={24} />
                    </div>
                    <div>
                      <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest">Destino do Saque</span>
                      <span className="block text-sm font-black text-gray-900 dark:text-white tracking-tight">Pix (CPF) • ***.***.***-25</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Valor do Saque</label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-300">R$</span>
                      <input 
                        type="text"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 rounded-3xl pl-16 pr-8 py-6 text-2xl font-black text-gray-900 dark:text-white border-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all shadow-inner"
                      />
                    </div>
                    <div className="flex justify-between px-2 pt-2">
                       <span className="text-[10px] font-bold text-gray-400">Taxa: Isento</span>
                       <span className="text-[10px] font-bold text-blue-600">Disponível: R$ 1.540,25</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleWithdrawAction}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-5.5 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-blue-100 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <Zap size={18} fill="currentColor" /> Confirmar Transferência
                </button>
              </div>
            ) : withdrawalStep === 'processing' ? (
              <div className="flex flex-col items-center py-16 animate-in zoom-in duration-500">
                <div className="relative mb-10">
                   <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-30"></div>
                   <Loader2 size={64} className="text-blue-600 animate-spin relative z-10" />
                </div>
                <h4 className="font-black text-xl text-gray-900 dark:text-white mb-2">Processando Saque</h4>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Verificando junto ao Banco...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center py-12 text-center animate-in zoom-in duration-700">
                <div className="w-24 h-24 bg-green-50 rounded-[2.5rem] flex items-center justify-center text-green-500 mb-8 shadow-xl shadow-green-100/50">
                  <CheckCircle2 size={50} strokeWidth={2.5} />
                </div>
                <h4 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2">Sucesso!</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-10 max-w-[250px]">
                  Seu saque de <b>R$ {withdrawAmount}</b> foi enviado e estará na sua conta em alguns minutos.
                </p>
                <button 
                  onClick={closeWithdrawal}
                  className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 py-5 rounded-[2.5rem] font-black text-sm uppercase tracking-widest active:scale-95 transition-all"
                >
                  Entendido
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal new post */}
      {isCreatingPost && (
        <div className="fixed inset-0 z-[100] bg-black/70 dark:bg-black/85 backdrop-blur-sm flex items-end animate-in fade-in duration-300">
          <div className="w-full bg-white dark:bg-slate-900 rounded-t-[3rem] p-10 animate-in slide-in-from-bottom-full duration-500 shadow-[0_-20px_50px_rgba(0,0,0,0.2)]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Criar Postagem</h3>
              <button onClick={() => setIsCreatingPost(false)} className="p-2.5 bg-gray-100 dark:bg-slate-800 rounded-full dark:text-white hover:rotate-90 transition-transform"><X size={20} /></button>
            </div>
            <textarea value={newCaption} onChange={(e) => setNewCaption(e.target.value)} placeholder="O que você quer anunciar hoje para seus alunos?" className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-[2rem] p-8 h-48 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all shadow-inner resize-none text-gray-700 dark:text-gray-200 font-bold placeholder:text-gray-400" />
            <button onClick={handlePostSubmit} disabled={!newCaption.trim()} className="w-full bg-blue-600 text-white py-5.5 rounded-[2.5rem] font-black text-base mt-8 shadow-2xl shadow-blue-200 dark:shadow-none active:scale-95 transition-all disabled:bg-gray-200 dark:disabled:bg-slate-800">Publicar no Feed</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletView;
