
import React, { useState } from 'react';
import { User, MapPin, Activity, ChevronRight } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const slides = [
    {
      title: "Bem-vindo ao Prático!",
      description: "O Prático conecta você à sua autoescola e também aos instrutores mais perto de você, transformando a jornada para conquistar a CNH em uma experiência simples, prática e acessível.",
      icon: <User size={80} className="text-blue-600" />,
      buttonText: "Próximo"
    },
    {
      title: "Procure instrutores que estão perto de você!",
      description: "Prepare-se para o exame prático com nossos melhores instrutores perto da sua localidade, de forma prática e com total confiança.",
      icon: <MapPin size={80} className="text-blue-600" />,
      buttonText: "Próximo"
    },
    {
      title: "Acompanhamento em tempo real!",
      description: "Se estiver matriculado em uma autoescola parceira do Prático, basta cadastrar-se para acessar o ambiente e monitorar seu progresso rumo à aprovação.",
      icon: <Activity size={80} className="text-blue-600" />,
      buttonText: "Começar"
    }
  ];

  const handleNext = () => {
    if (currentStep < slides.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white animate-in fade-in duration-500 relative">
      {/* Skip Button */}
      <div className="absolute top-6 right-6">
        <button 
          onClick={onComplete}
          className="text-gray-400 text-sm font-medium hover:text-blue-600 transition-colors"
        >
          Pular
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-10 text-center">
        {/* Icon Area with animated pulse effect */}
        <div className="mb-16 relative">
          <div className="absolute inset-0 bg-blue-50 rounded-full scale-150 blur-3xl opacity-50"></div>
          <div className="relative z-10 animate-in zoom-in duration-700">
            {slides[currentStep].icon}
          </div>
        </div>

        {/* Text Area */}
        <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-2xl font-black text-gray-900 leading-tight">
            {slides[currentStep].title}
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            {slides[currentStep].description}
          </p>
        </div>

        {/* Pagination Dots */}
        <div className="flex gap-2 mt-12 mb-10">
          {slides.map((_, idx) => (
            <div 
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentStep === idx ? 'w-8 bg-blue-600' : 'w-2 bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Action Button */}
        <button 
          onClick={handleNext}
          className="text-blue-600 font-black text-lg hover:underline transition-all active:scale-95"
        >
          {slides[currentStep].buttonText}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
