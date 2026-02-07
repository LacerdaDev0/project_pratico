
import { GoogleGenAI } from "@google/genai";

const getApiKey = () => {
  try {
    return process.env.API_KEY || '';
  } catch (e) {
    return '';
  }
};

// Lista de dicas reserva para quando a cota da API acabar
const FALLBACK_TIPS = [
  "Mantenha a calma e observe sempre os retrovisores antes de qualquer manobra.",
  "Sinalize todas as suas intenções com antecedência usando as setas.",
  "Ajuste o banco e os espelhos antes de colocar o cinto de segurança.",
  "Mantenha uma distância segura do veículo à frente para evitar frenagens bruscas.",
  "Reduza a velocidade gradualmente ao se aproximar de cruzamentos ou faixas de pedestre.",
  "Em subidas, use o freio de mão como auxílio para evitar que o carro desça.",
  "Mantenha as mãos na posição '10 para as 2' no volante para maior controle.",
  "Respire fundo antes de iniciar o exame prático; a ansiedade é sua maior adversária."
];

export const getInstructorAdvice = async (subject: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Gere uma única "Dica de Ouro" curta (máximo 100 caracteres) sobre ${subject}. A dica deve ser prática, direta e útil para um aluno de autoescola. Retorne apenas o texto da dica, sem aspas.`,
      config: {
        maxOutputTokens: 80,
        temperature: 0.7, 
      },
    });
    
    const text = response.text;
    return text || FALLBACK_TIPS[Math.floor(Math.random() * FALLBACK_TIPS.length)];
  } catch (error: any) {
    // Se for erro de quota (429), usamos o fallback silenciosamente para não quebrar a experiência
    console.warn("Gemini API Quota Exceeded or Error. Using static fallback.");
    return FALLBACK_TIPS[Math.floor(Math.random() * FALLBACK_TIPS.length)];
  }
};

export const generatePostCaption = async (type: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Crie uma legenda curta e vendedora para Instagram de um instrutor de ${type}.`,
      config: {
        maxOutputTokens: 100,
      }
    });
    return response.text || "Confira minhas aulas e agende já o seu horário!";
  } catch (error) {
    return "Confira minhas aulas e agende já o seu horário!";
  }
};
