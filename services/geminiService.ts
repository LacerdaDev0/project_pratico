
import { GoogleGenAI } from "@google/genai";

const FALLBACK_TIPS_STUDENT = [
  "Observe sempre os retrovisores antes de qualquer manobra.",
  "Sinalize todas as suas intenções com antecedência usando as setas.",
  "Ajuste o banco e os espelhos antes do cinto de segurança.",
  "Mantenha distância segura do veículo à frente.",
  "Reduza a velocidade gradualmente ao se aproximar de faixas.",
  "Em subidas, use o freio de mão como auxílio inicial.",
  "Mantenha as mãos na posição '10 para as 2' no volante.",
  "Respire fundo; a calma é sua maior aliada no exame."
];

const FALLBACK_TIPS_INSTRUCTOR = [
  "Mantenha o cockpit organizado; um ambiente limpo transmite profissionalismo.",
  "Higienize o volante e câmbio entre cada aula prática.",
  "Se instrutor de moto, verifique se os capacetes reserva estão sempre limpos.",
  "O perfume do carro deve ser suave para não incomodar alunos sensíveis.",
  "Documentação do veículo deve estar sempre acessível e organizada.",
  "Verifique a calibração dos pneus semanalmente para maior segurança.",
  "Mantenha água fresca disponível para você e ofereça ao aluno.",
  "Revise as luzes de freio e setas diariamente antes de iniciar as aulas."
];

export const getInstructorAdvice = async (role: 'student' | 'instructor' = 'student') => {
  try {
    // Always use new GoogleGenAI({apiKey: process.env.API_KEY}); as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = role === 'instructor' 
      ? `Você é um consultor para instrutores de trânsito profissionais. Gere uma "Dica de Ouro" curta (máx 90 caracteres) sobre organização do ambiente de trabalho (carro/moto), manutenção preventiva simples, higiene de equipamentos (capacetes) ou postura profissional. Seja direto e prático. Retorne apenas o texto.`
      : `Gere uma única "Dica de Ouro" curta (máx 90 caracteres) sobre direção defensiva ou segurança para alunos de autoescola. Retorne apenas o texto.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        maxOutputTokens: 60,
        temperature: 0.8, 
      },
    });
    
    // Accessing response.text directly as a property
    const text = response.text?.trim();
    if (!text) throw new Error("Empty response");
    
    return text;
  } catch (error: any) {
    const fallbacks = role === 'instructor' ? FALLBACK_TIPS_INSTRUCTOR : FALLBACK_TIPS_STUDENT;
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
};

export const generatePostCaption = async (type: string) => {
  try {
    // Always use new GoogleGenAI({apiKey: process.env.API_KEY}); as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Crie uma legenda curta e vendedora para Instagram de um instrutor de ${type}.`,
      config: {
        maxOutputTokens: 100,
      }
    });
    // Accessing response.text directly as a property
    return response.text || "Confira minhas aulas e agende já o seu horário!";
  } catch (error) {
    return "Confira minhas aulas e agende já o seu horário!";
  }
};
