// services/instructorService.ts
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Importa a instância do Firestore do seu arquivo de configuração

interface Instructor {
  id: string;
  name: string;
  rating: number;
  distance: number;
  price: number;
  avatarUrl: string;
}

export async function getInstructors(): Promise<Instructor[]> {
  const instructorsCollectionRef = collection(db, 'instructors');
  const querySnapshot = await getDocs(instructorsCollectionRef);

  const instructors: Instructor[] = [];
  querySnapshot.forEach((doc) => {
    // Certifique-se de que os campos existam nos seus documentos do Firestore
    const data = doc.data();
    instructors.push({
      id: doc.id,
      name: data.name,
      rating: data.rating,
      distance: data.distance,
      price: data.price,
      avatarUrl: data.avatarUrl,
    });
  });

  return instructors;
}
