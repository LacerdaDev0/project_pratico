import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "./firebaseConfig";

// Mantemos a mesma estrutura de dados
export interface Instructor {
  id: string;
  name: string;
  rating: number;
  distance: string;
  price: number;
  avatarUrl: string;
  category: string;
}

// Esta função agora aceita um "callback" para avisar o React quando o dado mudar
export const streamInstructors = (callback: (instructors: Instructor[]) => void) => {
  const q = query(collection(db, 'instructors'));
  
  // O onSnapshot fica "ouvindo" o Firebase 24h por dia
  return onSnapshot(q, (snapshot) => {
    const instructorList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Instructor[];
    
    callback(instructorList);
  });
};
