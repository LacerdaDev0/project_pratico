
export enum AppTab {
  FEED = 'feed',
  MAP = 'map',
  SCHEDULES = 'schedules',
  PROFILE = 'profile',
  CHAT = 'chat',
  CHAT_LIST = 'chat_list',
  INSTRUCTOR_PROFILE = 'instructor_profile'
}

export type UserRole = 'student' | 'instructor' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
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

// MOCK_INSTRUCTORS moved to a central place for lookup
export const MOCK_INSTRUCTORS: Instructor[] = [
  { id: '1', name: 'Rodrigo Silva', specialty: 'Instrutor de Carro', rating: 4.8, price: 120, avatar: 'https://picsum.photos/seed/rodrigo/100/100', location: { lat: 35, lng: 45 }, bio: 'Especialista em baliza e direção defensiva.', licenseType: 'B', distance: 2.5 },
  { id: '2', name: 'Ana Oliveira', specialty: 'Instrutora de Moto', rating: 4.9, price: 80, avatar: 'https://picsum.photos/seed/ana/100/100', location: { lat: 55, lng: 25 }, bio: 'Aulas noturnas disponíveis e foco em equilíbrio.', licenseType: 'A', distance: 0.8 },
  { id: '3', name: 'Carlos M.', specialty: 'Carro e Moto', rating: 4.7, price: 150, avatar: 'https://picsum.photos/seed/carlos/100/100', location: { lat: 25, lng: 65 }, bio: 'Personal trainer para recém-habilitados.', licenseType: 'AB', distance: 5.2 },
  { id: '4', name: 'Beatriz G.', specialty: 'Instrutora de Carro', rating: 5.0, price: 200, avatar: 'https://picsum.photos/seed/beatriz/100/100', location: { lat: 65, lng: 55 }, bio: 'Foco total em perder o medo de dirigir no trânsito.', licenseType: 'B', distance: 1.2 },
  { id: '5', name: 'João Paulo', specialty: 'Instrutor de Moto', rating: 4.5, price: 90, avatar: 'https://picsum.photos/seed/joao/100/100', location: { lat: 45, lng: 75 }, bio: 'Experiência com trilha e asfalto há mais de 10 anos.', licenseType: 'A', distance: 4.4 },
  { id: '6', name: 'Lucas H.', specialty: 'Carro Profissional', rating: 4.9, price: 180, avatar: 'https://picsum.photos/seed/lucas/100/100', location: { lat: 75, lng: 85 }, bio: 'Aulas intensivas para passar no exame do DETRAN.', licenseType: 'B', distance: 8.5 },
];
