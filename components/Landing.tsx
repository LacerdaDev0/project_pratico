
import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { ChevronRight, User as UserIcon, Briefcase, Map as MapIcon, Building2, ArrowLeft, AlertCircle, CheckCircle2, Search, Fingerprint, Lock, Car, Bike, History, Layers, Loader2 } from 'lucide-react';

interface LandingProps {
  onLoginSuccess: (user: User) => void;
}

// Internal user type to handle persistence in mock state
interface RegisteredUser extends User {
  password?: string;
}

// Initial mock credentials with explicit roles
const INITIAL_USERS: RegisteredUser[] = [
  { id: 'admin-id', name: 'Administrador Prático', email: 'admin@pratico.com', password: '123456', role: 'student' },
  { id: 'inst-admin', name: 'Instrutor Master', email: 'instrutor@pratico.com', password: '123456', role: 'instructor' }
];

const MOCK_PARTNER_SCHOOLS = [
  "Autoescola Piloto",
  "Centro de Formação de Condutores Águia",
  "Autoescola Avenida",
  "CFC Via Brasil",
  "Escola de Motoristas Elite"
];

// Custom Steering Wheel SVG for a premium logo feel
const SteeringWheelIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="2" />
    <path d="M12 2v8" />
    <path d="M12 14v8" />
    <path d="M2 12h8" />
    <path d="M14 12h8" />
  </svg>
);

const GoogleIcon = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const Landing: React.FC<LandingProps> = ({ onLoginSuccess }) => {
  const [view, setView] = useState<'main' | 'studentSelection' | 'login' | 'signup' | 'autoescolaLogin' | 'instructorDetails'>('main');
  const [users, setUsers] = useState<RegisteredUser[]>(INITIAL_USERS);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [school, setSchool] = useState('');
  
  // Google Simulation State
  const [isGoogleSelecting, setIsGoogleSelecting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Instructor specific state
  const [vehicleType, setVehicleType] = useState<'car' | 'moto' | 'both'>('car');
  const [plate, setPlate] = useState('');
  const [experience, setExperience] = useState('');

  const [errorType, setErrorType] = useState<'empty' | 'invalid' | 'invalid_plate' | 'wrong_role' | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');

  const handleStudentClick = () => {
    setSelectedRole('student');
    setView('studentSelection');
  };

  const handleBackToStart = () => {
    setView('main');
  };

  const handleBackToSelection = () => {
    if (selectedRole === 'instructor') {
      setView('main');
    } else {
      setView('studentSelection');
    }
    setErrorType(null);
  };

  const goToLogin = () => {
    setView('login');
    setErrorType(null);
  };

  const goToSignUp = () => {
    setView('signup');
    setErrorType(null);
  };

  const goToAutoescolaLogin = () => {
    setView('autoescolaLogin');
    setErrorType(null);
  };

  const handleAppEntry = () => {
    if (email.trim() === '' || password.trim() === '') {
      setErrorType('empty');
      return;
    }

    const userFound = users.find(u => u.email.trim().toLowerCase() === email.trim().toLowerCase() && u.password === password);

    if (userFound) {
      if (userFound.role !== selectedRole) {
        setErrorType('wrong_role');
        return;
      }

      onLoginSuccess({
        id: userFound.id,
        name: userFound.name,
        email: userFound.email,
        role: userFound.role
      });
    } else {
      setErrorType('invalid');
    }
  };

  const handleAutoescolaEntry = () => {
    if (cpf.trim() === '' || password.trim() === '' || school.trim() === '') {
      setErrorType('empty');
      return;
    }

    // Apenas permite entrar se CPF for '10' e Senha for '10'
    if (cpf.trim() === '10' && password.trim() === '10') {
      onLoginSuccess({
        id: `acc-${Date.now()}`,
        name: 'Aluno Credenciado (10)',
        email: '10@autoescola.br',
        role: 'student'
      });
    } else {
      setErrorType('invalid');
    }
  };

  const handleSignUpComplete = () => {
    if (name.trim() === '' || email.trim() === '' || password.trim() === '') {
      setErrorType('empty');
      return;
    }
    
    if (selectedRole === 'instructor') {
      setView('instructorDetails');
      setErrorType(null);
      return;
    }

    const newUser: RegisteredUser = { 
      id: Date.now().toString(), 
      name: name.trim(), 
      email: email.trim(), 
      password: password,
      role: 'student'
    };
    setUsers(prev => [...prev, newUser]);

    setShowSuccess(true);
    setView('login');
    setErrorType(null);
    setEmail(email.trim());
    setPassword('');
    
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const handleInstructorDetailsFinish = () => {
    const plateRegex = /^[A-Z]{3}-?[0-9][A-Z0-9][0-9]{2}$/i;
    
    if (plate.trim() === '' || experience.trim() === '') {
      setErrorType('empty');
      return;
    }

    if (!plateRegex.test(plate.trim().replace(' ', ''))) {
      setErrorType('invalid_plate');
      return;
    }

    const newUser: RegisteredUser = { 
      id: Date.now().toString(), 
      name: name.trim(), 
      email: email.trim(), 
      password: password,
      role: 'instructor'
    };
    
    setUsers(prev => [...prev, newUser]);

    setShowSuccess(true);
    setView('login');
    setErrorType(null);
    setEmail(email.trim());
    setPassword('');
    
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const handleGoogleLoginClick = () => {
    setIsGoogleSelecting(true);
  };

  const finalizeGoogleLogin = (userName: string, userEmail: string) => {
    setIsGoogleSelecting(false);
    setIsGoogleLoading(true);
    
    // Artificial delay to simulate "vincular e entrar"
    setTimeout(() => {
      setIsGoogleLoading(false);
      onLoginSuccess({
        id: `google-${Date.now()}`,
        name: userName,
        email: userEmail,
        role: selectedRole // Uses the role selected previously in the UI
      });
    }, 1200);
  };

  if (isGoogleLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center animate-in fade-in duration-300">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20"></div>
            <GoogleIcon size={48} />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-black text-[#1a237e] uppercase tracking-tighter">Entrando com Google</h3>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Sincronizando seus dados...</p>
          </div>
          <Loader2 className="animate-spin text-blue-600 mt-4" size={24} />
        </div>
      </div>
    );
  }

  if (isGoogleSelecting) {
    return (
      <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
        <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="p-8 text-center border-b border-gray-50">
            <div className="flex justify-center mb-6">
              <GoogleIcon size={32} />
            </div>
            <h3 className="text-xl font-black text-gray-900 leading-tight mb-2">Fazer login</h3>
            <p className="text-sm text-gray-500 font-medium">Escolha uma conta para prosseguir para <span className="text-blue-600 font-black">Prático</span></p>
          </div>
          
          <div className="p-4 flex flex-col">
            {[
              { name: 'Gabriel Lacerda', email: 'gabriel.lacerda@gmail.com', avatar: 'https://picsum.photos/seed/gabriel/100/100' },
              { name: 'Fernanda Oliveira', email: 'fernanda.oliveira@gmail.com', avatar: 'https://picsum.photos/seed/fernanda/100/100' }
            ].map((account) => (
              <button 
                key={account.email}
                onClick={() => finalizeGoogleLogin(account.name, account.email)}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors rounded-2xl text-left border border-transparent hover:border-gray-100 mb-2 last:mb-0"
              >
                <img src={account.avatar} alt={account.name} className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm" />
                <div className="flex-1">
                  <span className="block text-sm font-black text-gray-900">{account.name}</span>
                  <span className="block text-xs text-gray-400 font-medium">{account.email}</span>
                </div>
                <ChevronRight size={16} className="text-gray-200" />
              </button>
            ))}
            
            <button 
              onClick={() => setIsGoogleSelecting(false)}
              className="mt-4 p-4 text-center text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-blue-600 transition-colors"
            >
              Cancelar
            </button>
          </div>
          
          <div className="bg-gray-50 p-6 text-[10px] text-gray-400 leading-relaxed text-center font-medium">
            Para continuar, o Google compartilhará seu nome, endereço de e-mail e foto do perfil com o app Prático.
          </div>
        </div>
      </div>
    );
  }

  if (view === 'instructorDetails') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-8 text-center animate-in fade-in duration-500">
        <div className="w-full max-w-xs flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 shadow-sm border border-blue-100">
            <Briefcase size={32} />
          </div>
          <h2 className="text-3xl font-black text-[#1a237e] uppercase tracking-tight mb-1">
            DADOS PROFISSIONAIS
          </h2>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-10">
            COMPLETE SEU PERFIL DE INSTRUTOR
          </p>

          <div className="w-full flex flex-col gap-5 mb-8">
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => setVehicleType('car')}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all ${vehicleType === 'car' ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-gray-50 border-transparent text-gray-400'}`}
              >
                <Car size={20} />
                <span className="text-[9px] font-black uppercase tracking-wider">Carro</span>
              </button>
              <button 
                onClick={() => setVehicleType('moto')}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all ${vehicleType === 'moto' ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-gray-50 border-transparent text-gray-400'}`}
              >
                <Bike size={20} />
                <span className="text-[9px] font-black uppercase tracking-wider">Moto</span>
              </button>
              <button 
                onClick={() => setVehicleType('both')}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all ${vehicleType === 'both' ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-gray-50 border-transparent text-gray-400'}`}
              >
                <Layers size={20} />
                <span className="text-[9px] font-black uppercase tracking-wider">Ambos</span>
              </button>
            </div>

            <div className="relative">
              <input 
                type="text" 
                placeholder="Placa do Veículo (ex: ABC-1234)" 
                value={plate}
                onChange={(e) => { setPlate(e.target.value); setErrorType(null); }}
                className={`w-full bg-gray-50 border-2 ${errorType === 'invalid_plate' || (errorType === 'empty' && !plate) ? 'border-red-200' : 'border-transparent'} rounded-3xl px-6 py-5 text-sm font-semibold focus:ring-2 focus:ring-blue-100 transition-all outline-none text-gray-700 uppercase`}
              />
              <Fingerprint className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-200" size={18} />
            </div>

            <div className="relative">
              <input 
                type="number" 
                placeholder="Anos de Experiência" 
                value={experience}
                onChange={(e) => { setExperience(e.target.value); setErrorType(null); }}
                className={`w-full bg-gray-50 border-2 ${errorType === 'empty' && !experience ? 'border-red-200' : 'border-transparent'} rounded-3xl px-6 py-5 text-sm font-semibold focus:ring-2 focus:ring-blue-100 transition-all outline-none text-gray-700`}
              />
              <History className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-200" size={18} />
            </div>

            {errorType === 'empty' && (
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider">
                Preencha todos os campos obrigatórios
              </p>
            )}
            {errorType === 'invalid_plate' && (
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider">
                Informe uma placa válida
              </p>
            )}
          </div>

          <button 
            onClick={handleInstructorDetailsFinish}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-5 rounded-[2.5rem] font-bold text-sm tracking-widest shadow-2xl shadow-blue-400/30 hover:from-blue-700 hover:to-blue-600 active:scale-[0.98] transition-all uppercase mb-10 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <span className="relative z-10">FINALIZAR CADASTRO</span>
          </button>

          <button 
            onClick={() => setView('signup')}
            className="flex items-center gap-2 text-gray-400 font-bold text-xs hover:text-blue-500 transition-colors uppercase tracking-widest"
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
            Voltar
          </button>
        </div>
      </div>
    );
  }

  if (view === 'autoescolaLogin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-8 text-center animate-in fade-in duration-500">
        <div className="w-full max-w-xs flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 shadow-sm border border-blue-100">
            <Building2 size={32} />
          </div>
          <h2 className="text-3xl font-black text-[#1a237e] uppercase tracking-tight mb-1">
            ACESSO CREDENCIADO
          </h2>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-10">
            CONECTE-SE WITH SUA AUTOESCOLA
          </p>

          <div className="w-full flex flex-col gap-4 mb-8">
            <div className="relative">
              <select 
                value={school}
                onChange={(e) => { setSchool(e.target.value); setErrorType(null); }}
                className={`w-full bg-gray-50 border-2 ${errorType === 'empty' && !school ? 'border-red-200' : 'border-transparent'} rounded-3xl px-6 py-4 text-sm font-semibold focus:ring-2 focus:ring-blue-100 transition-all outline-none text-gray-700 appearance-none`}
              >
                <option value="">Selecione sua Autoescola</option>
                {MOCK_PARTNER_SCHOOLS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 rotate-90 pointer-events-none" size={16} />
            </div>
            
            <div className="relative">
              <input 
                type="text" 
                placeholder="CPF do Aluno" 
                value={cpf}
                onChange={(e) => { setCpf(e.target.value); setErrorType(null); }}
                className={`w-full bg-gray-50 border-2 ${(errorType === 'empty' && !cpf) || errorType === 'invalid' ? 'border-red-200' : 'border-transparent'} rounded-3xl px-6 py-4 text-sm font-semibold focus:ring-2 focus:ring-blue-100 transition-all outline-none text-gray-700`}
              />
              <Fingerprint className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-200" size={18} />
            </div>

            <div className="relative">
              <input 
                type="password" 
                placeholder="Senha da Autoescola" 
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrorType(null); }}
                className={`w-full bg-gray-50 border-2 ${(errorType === 'empty' && !password) || errorType === 'invalid' ? 'border-red-200' : 'border-transparent'} rounded-3xl px-6 py-4 text-sm font-semibold focus:ring-2 focus:ring-blue-100 transition-all outline-none text-gray-700`}
              />
              <Lock className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-200" size={18} />
            </div>

            {(errorType === 'empty' || errorType === 'invalid') && (
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider mt-2">
                {errorType === 'empty' ? 'Preencha todos os dados credenciados' : 'CPF ou senha credenciada incorretos'}
              </p>
            )}
          </div>

          <button 
            onClick={handleAutoescolaEntry}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-5 rounded-[2.5rem] font-bold text-sm tracking-widest shadow-2xl shadow-blue-400/30 hover:from-blue-700 hover:to-blue-600 active:scale-[0.98] transition-all uppercase mb-10 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <span className="relative z-10">CONECTAR AGORA</span>
          </button>

          <button 
            onClick={handleBackToSelection}
            className="flex items-center gap-2 text-gray-400 font-bold text-xs hover:text-blue-500 transition-colors uppercase tracking-widest"
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
            Voltar
          </button>
        </div>
      </div>
    );
  }

  if (view === 'signup') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-8 text-center animate-in fade-in duration-500">
        <div className="w-full max-w-xs flex flex-col items-center">
          <h2 className="text-3xl font-black text-[#1a237e] uppercase tracking-tight mb-1">
            CRIE SUA CONTA
          </h2>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-12">
            CADASTRO COMO {selectedRole === 'instructor' ? 'INSTRUTOR' : 'ALUNO'}
          </p>

          <div className="w-full flex flex-col gap-4 mb-10">
            <input 
              type="text" 
              placeholder="Nome Completo" 
              value={name}
              onChange={(e) => { setName(e.target.value); setErrorType(null); }}
              className={`w-full bg-gray-50 border-2 ${errorType && !name ? 'border-red-200' : 'border-transparent'} rounded-3xl px-6 py-5 text-sm font-semibold focus:ring-2 focus:ring-blue-100 transition-all outline-none text-gray-700 placeholder:text-gray-400`}
            />
            <input 
              type="email" 
              placeholder="E-mail" 
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrorType(null); }}
              className={`w-full bg-gray-50 border-2 ${errorType && !email ? 'border-red-200' : 'border-transparent'} rounded-3xl px-6 py-5 text-sm font-semibold focus:ring-2 focus:ring-blue-100 transition-all outline-none text-gray-700 placeholder:text-gray-400`}
            />
            <input 
              type="password" 
              placeholder="Senha" 
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrorType(null); }}
              className={`w-full bg-gray-50 border-2 ${errorType && !password ? 'border-red-200' : 'border-transparent'} rounded-3xl px-6 py-5 text-sm font-semibold focus:ring-2 focus:ring-blue-100 transition-all outline-none text-gray-700 placeholder:text-gray-400`}
            />
            {errorType === 'empty' && (
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider mt-2">
                Preencha todos os campos para cadastrar
              </p>
            )}
          </div>

          <button 
            onClick={handleSignUpComplete}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-5 rounded-[2.5rem] font-bold text-sm tracking-widest shadow-2xl shadow-blue-400/30 hover:from-blue-700 hover:to-blue-600 active:scale-[0.98] transition-all uppercase mb-10 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <span className="relative z-10">{selectedRole === 'instructor' ? 'PRÓXIMA ETAPA' : 'CRIAR MINHA CONTA'}</span>
          </button>

          <button 
            onClick={goToLogin}
            className="flex items-center gap-2 text-gray-400 font-bold text-xs hover:text-blue-500 transition-colors uppercase tracking-widest mb-12"
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
            Voltar
          </button>
        </div>

        <div className="absolute bottom-10 left-0 right-0">
          <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.25em] leading-relaxed max-w-[280px] mx-auto">
            AO ENTRAR, VOCÊ CONCORDA COM NOSSOS<br/>
            <span className="text-gray-400 cursor-pointer hover:text-blue-500 transition-colors underline decoration-gray-200">TERMOS DE USO</span> E <span className="text-gray-400 cursor-pointer hover:text-blue-500 transition-colors underline decoration-gray-200">PRIVACIDADE</span>.
          </p>
        </div>
      </div>
    );
  }

  if (view === 'login') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-8 text-center animate-in fade-in duration-500">
        <div className="w-full max-w-xs flex flex-col items-center">
          <h2 className="text-3xl font-black text-[#1a237e] uppercase tracking-tight mb-1">
            ENTRAR
          </h2>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-10">
            ACESSO COMO {selectedRole === 'instructor' ? 'INSTRUTOR' : 'ALUNO'}
          </p>

          <div className="w-full flex flex-col gap-4 mb-8">
            {showSuccess && (
              <div className="flex items-center justify-center gap-2 mb-4 p-3 bg-green-50 rounded-2xl border border-green-100 animate-in fade-in zoom-in duration-300">
                <CheckCircle2 size={16} className="text-green-500" />
                <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Conta criada com sucesso!</p>
              </div>
            )}
            <input 
              type="email" 
              placeholder="E-mail" 
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrorType(null); }}
              className={`w-full bg-gray-50 border-2 ${errorType ? 'border-red-200' : 'border-transparent'} rounded-3xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-blue-100 transition-all outline-none text-gray-700`}
            />
            <input 
              type="password" 
              placeholder="Senha" 
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrorType(null); }}
              className={`w-full bg-gray-50 border-2 ${errorType ? 'border-red-200' : 'border-transparent'} rounded-3xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-blue-100 transition-all outline-none text-gray-700`}
            />
            {errorType && (
              <div className="flex items-center justify-center gap-2 mt-2 animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={14} className="text-red-500" />
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider">
                  {errorType === 'empty' ? 'Preencha todos os campos' : 
                   errorType === 'wrong_role' ? `Esta conta não é de ${selectedRole === 'instructor' ? 'Instrutor' : 'Aluno'}` :
                   'E-mail ou senha incorretos'}
                </p>
              </div>
            )}
          </div>

          <button 
            onClick={handleAppEntry}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 rounded-[2.5rem] font-bold text-sm tracking-widest shadow-2xl shadow-blue-400/50 hover:from-blue-700 hover:to-blue-600 active:scale-[0.98] transition-all uppercase mb-8 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <span className="relative z-10">ENTRAR NO APLICATIVO</span>
          </button>

          {/* Somente alunos podem entrar com Google */}
          {selectedRole === 'student' && (
            <>
              <div className="w-full flex items-center gap-4 mb-8">
                <div className="h-[1px] flex-1 bg-gray-100"></div>
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">ou</span>
                <div className="h-[1px] flex-1 bg-gray-100"></div>
              </div>

              <button 
                onClick={handleGoogleLoginClick}
                className="w-full bg-gray-50 flex items-center justify-center gap-3 py-4 rounded-[2.5rem] hover:bg-gray-100 active:scale-[0.98] transition-all mb-8 shadow-sm border border-transparent hover:border-gray-200"
              >
                <GoogleIcon />
                <span className="text-sm font-bold text-gray-700">Entrar com Google</span>
              </button>
            </>
          )}

          <p className="text-xs font-bold text-gray-400 mb-10">
            Ainda não tem conta? <span onClick={goToSignUp} className="text-blue-600 cursor-pointer hover:underline font-black">Cadastre-se</span>
          </p>

          <button 
            onClick={handleBackToSelection}
            className="flex items-center gap-2 text-gray-400 font-bold text-xs hover:text-blue-500 transition-colors uppercase tracking-widest"
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
            Voltar
          </button>
        </div>

        <div className="absolute bottom-10 left-0 right-0">
          <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.25em] leading-relaxed max-w-[280px] mx-auto">
            AO ENTRAR, VOCÊ CONCORDA COM NOSSOS<br/>
            <span className="text-gray-400 cursor-pointer hover:text-blue-500 transition-colors underline decoration-gray-200">TERMOS DE USO</span> E <span className="text-gray-400 cursor-pointer hover:text-blue-500 transition-colors underline decoration-gray-200">PRIVACIDADE</span>.
          </p>
        </div>
      </div>
    );
  }

  if (view === 'studentSelection') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-8 text-center animate-in fade-in duration-500">
        <div className="w-full max-w-xs flex flex-col items-center">
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-12">
            COMO DESEJA PROSSEGUIR?
          </h2>

          <div className="w-full flex flex-col gap-5">
            <button 
              onClick={goToLogin}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 p-6 rounded-[2.5rem] flex items-center justify-between shadow-2xl shadow-blue-100 group active:scale-[0.98] transition-all relative overflow-hidden text-left"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white shadow-inner flex-shrink-0">
                  <MapIcon size={28} strokeWidth={2} />
                </div>
                <div>
                  <span className="block text-white font-bold text-lg tracking-tight leading-tight">Motorista Autônomo</span>
                  <span className="block text-blue-100 text-[10px] font-bold uppercase tracking-wider mt-0.5">Buscar instrutores e aulas</span>
                </div>
              </div>
              <ChevronRight className="text-white opacity-60 group-hover:translate-x-1 transition-transform relative z-10" />
            </button>

            <button 
              onClick={goToAutoescolaLogin}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 p-6 rounded-[2.5rem] flex items-center justify-between shadow-2xl shadow-indigo-100 group active:scale-[0.98] transition-all relative overflow-hidden text-left"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white shadow-inner flex-shrink-0">
                  <Building2 size={28} strokeWidth={2} />
                </div>
                <div>
                  <span className="block text-white font-bold text-lg tracking-tight leading-tight">Aluno de Autoescola</span>
                  <span className="block text-indigo-100 text-[10px] font-bold uppercase tracking-wider mt-0.5">Meu cadastro da escola</span>
                </div>
              </div>
              <ChevronRight className="text-white opacity-60 group-hover:translate-x-1 transition-transform relative z-10" />
            </button>
          </div>

          <button 
            onClick={handleBackToStart}
            className="mt-12 flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-blue-500 transition-colors py-2 px-6 rounded-full border border-gray-100 bg-white shadow-sm"
          >
            <ArrowLeft size={14} strokeWidth={3} />
            Voltar ao início
          </button>
        </div>

        <div className="absolute bottom-10 left-0 right-0">
          <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.25em] leading-relaxed max-w-[280px] mx-auto">
            AO ENTRAR, VOCÊ CONCORDA COM NOSSOS<br/>
            <span className="text-gray-400 cursor-pointer hover:text-blue-500 transition-colors underline decoration-gray-200">TERMOS DE USO</span> E <span className="text-gray-400 cursor-pointer hover:text-blue-500 transition-colors underline decoration-gray-200">PRIVACIDADE</span>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-8 text-center animate-in fade-in duration-1000">
      <div className="mb-16 flex flex-col items-center">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-blue-200 mb-6 transform hover:rotate-12 transition-transform duration-500">
          <SteeringWheelIcon className="w-14 h-14" />
        </div>
        <h1 className="text-3xl font-black tracking-[0.3em] text-blue-600 uppercase">
          PRÁTICO
        </h1>
        <p className="mt-3 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">
          Conectando você à sua liberdade no volante
        </p>
      </div>

      <div className="w-full max-w-xs flex flex-col gap-5">
        <button 
          onClick={handleStudentClick}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 p-6 rounded-[2.5rem] flex items-center justify-between shadow-2xl shadow-blue-100 group active:scale-[0.98] transition-all relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white shadow-inner">
              <UserIcon size={30} strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <span className="block text-white font-bold text-xl tracking-tight leading-tight">Sou Aluno</span>
              <span className="block text-blue-100 text-[10px] font-bold uppercase tracking-wider mt-0.5">Quero aprender</span>
            </div>
          </div>
          <ChevronRight className="text-white opacity-60 group-hover:translate-x-1 transition-transform relative z-10" />
        </button>

        <button 
          onClick={() => { setSelectedRole('instructor'); setView('login'); }}
          className="w-full bg-white p-6 rounded-[2.5rem] flex items-center justify-between border-2 border-gray-50 shadow-xl shadow-gray-100/30 group active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
              <Briefcase size={28} strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <span className="block text-gray-800 font-bold text-xl tracking-tight leading-tight">Sou Instrutor</span>
              <span className="block text-gray-400 text-[10px] font-bold uppercase tracking-wider mt-0.5">Quero ensinar</span>
            </div>
          </div>
          <ChevronRight className="text-gray-300 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="mt-20 space-y-4">
        <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.25em] leading-relaxed max-w-[280px] mx-auto">
          AO ENTRAR, VOCÊ CONCORDA COM NOSSOS<br/>
          <span className="text-gray-400 cursor-pointer hover:text-blue-500 transition-colors underline decoration-gray-200">TERMOS DE USO</span> E <span className="text-gray-400 cursor-pointer hover:text-blue-500 transition-colors underline decoration-gray-200">PRIVACIDADE</span>.
        </p>
      </div>
    </div>
  );
};

export default Landing;
