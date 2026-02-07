
export enum AppTab {
  FEED = 'feed',
  MAP = 'map',
  WALLET = 'wallet',
  SCHEDULES = 'schedules',
  PROFILE = 'profile',
  CHAT = 'chat',
  CHAT_LIST = 'chat_list',
  INSTRUCTOR_PROFILE = 'instructor_profile',
  STUDIES = 'studies',
  SIMULADO = 'simulado'
}

export type UserRole = 'student' | 'instructor' | null;

export interface VehicleInfo {
  type: 'car' | 'moto' | 'both';
  model?: string;
  color?: string;
  plate?: string;
  year?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isCredentialed?: boolean;
  cpf?: string;
  vehicle?: VehicleInfo;
  bio?: string;
  experience?: string;
}

export type LicenseType = 'A' | 'B' | 'AB';

export interface Instructor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  price: number;
  avatar: string;
  location: {
    lat: number;
    lng: number;
  };
  bio: string;
  licenseType: LicenseType;
  distance: number; // in km
}

export interface Post {
  id: string;
  instructorId: string;
  instructorName: string;
  instructorAvatar: string;
  instructorCategory: string;
  imageUrl: string;
  caption: string;
  likes: number;
  timestamp: string;
}

export interface Booking {
  id: string;
  instructorId: string;
  instructorName: string;
  instructorAvatar: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'completed';
  subject: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface ChatThread {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  unreadCount: number;
  messages: Message[];
}

// MOCK_INSTRUCTORS com densidade aumentada para visualização no mapa
export const MOCK_INSTRUCTORS: Instructor[] = [
  { id: '1', name: 'Rodrigo Silva', specialty: 'Instrutor de Carro', rating: 4.8, price: 120, avatar: 'https://picsum.photos/seed/rodrigo/100/100', location: { lat: 35, lng: 45 }, bio: 'Especialista em baliza e direção defensiva.', licenseType: 'B', distance: 2.5 },
  { id: '2', name: 'Ana Oliveira', specialty: 'Instrutora de Moto', rating: 4.9, price: 80, avatar: 'https://picsum.photos/seed/ana/100/100', location: { lat: 55, lng: 25 }, bio: 'Aulas noturnas disponíveis e foco em equilíbrio.', licenseType: 'A', distance: 0.8 },
  { id: '3', name: 'Carlos M.', specialty: 'Carro e Moto', rating: 4.7, price: 150, avatar: 'https://picsum.photos/seed/carlos/100/100', location: { lat: 25, lng: 65 }, bio: 'Personal trainer para recém-habilitados.', licenseType: 'AB', distance: 5.2 },
  { id: '4', name: 'Beatriz G.', specialty: 'Instrutora de Carro', rating: 5.0, price: 200, avatar: 'https://picsum.photos/seed/beatriz/100/100', location: { lat: 65, lng: 55 }, bio: 'Foco total em perder o medo de dirigir no trânsito.', licenseType: 'B', distance: 1.2 },
  { id: '5', name: 'João Paulo', specialty: 'Instrutor de Moto', rating: 4.5, price: 90, avatar: 'https://picsum.photos/seed/joao/100/100', location: { lat: 45, lng: 75 }, bio: 'Experiência com trilha e asfalto há mais de 10 anos.', licenseType: 'A', distance: 4.4 },
  { id: '6', name: 'Lucas H.', specialty: 'Carro Profissional', rating: 4.9, price: 180, avatar: 'https://picsum.photos/seed/lucas/100/100', location: { lat: 75, lng: 85 }, bio: 'Aulas intensivas para passar no exame do DETRAN.', licenseType: 'B', distance: 8.5 },
  { id: '7', name: 'Mariana Costa', specialty: 'Instrutora de Carro', rating: 4.6, price: 110, avatar: 'https://picsum.photos/seed/mariana/100/100', location: { lat: 20, lng: 30 }, bio: 'Paciência e didática para quem está começando do zero.', licenseType: 'B', distance: 3.1 },
  { id: '8', name: 'Felipe Santos', specialty: 'Instrutor de Moto', rating: 4.4, price: 75, avatar: 'https://picsum.photos/seed/felipe/100/100', location: { lat: 80, lng: 40 }, bio: 'Foco em técnicas de frenagem e curvas.', licenseType: 'A', distance: 6.7 },
  { id: '9', name: 'Juliana Lima', specialty: 'Carro e Moto', rating: 4.9, price: 160, avatar: 'https://picsum.photos/seed/juliana/100/100', location: { lat: 15, lng: 50 }, bio: 'Especialista em PCD e direção adaptada.', licenseType: 'AB', distance: 1.5 },
  { id: '10', name: 'Ricardo Alencar', specialty: 'Instrutor de Carro', rating: 4.3, price: 95, avatar: 'https://picsum.photos/seed/ricardo/100/100', location: { lat: 40, lng: 15 }, bio: 'Aulas em horários flexíveis.', licenseType: 'B', distance: 4.2 },
  { id: '11', name: 'Fernanda Rocha', specialty: 'Instrutora de Moto', rating: 4.8, price: 85, avatar: 'https://picsum.photos/seed/fernanda/100/100', location: { lat: 60, lng: 70 }, bio: 'Ajudo você a dominar a moto.', licenseType: 'A', distance: 2.9 },
  { id: '12', name: 'Marcelo Viana', specialty: 'Instrutor de Carro', rating: 4.5, price: 130, avatar: 'https://picsum.photos/seed/marcelo/100/100', location: { lat: 90, lng: 20 }, bio: 'Treinamento focado no exame.', licenseType: 'B', distance: 9.1 },
  { id: '13', name: 'Camila Souza', specialty: 'Carro e Moto', rating: 4.7, price: 140, avatar: 'https://picsum.photos/seed/camila/100/100', location: { lat: 10, lng: 80 }, bio: 'Didática facilitada.', licenseType: 'AB', distance: 5.8 },
  { id: '14', name: 'Gustavo Paiva', specialty: 'Instrutor de Carro', rating: 4.2, price: 100, avatar: 'https://picsum.photos/seed/gustavo/100/100', location: { lat: 30, lng: 90 }, bio: 'Carro novo e confortável.', licenseType: 'B', distance: 7.3 },
  { id: '15', name: 'Priscila Dias', specialty: 'Instrutora de Moto', rating: 4.6, price: 90, avatar: 'https://picsum.photos/seed/priscila/100/100', location: { lat: 50, lng: 10 }, bio: 'Paciência total.', licenseType: 'A', distance: 0.5 },
];
