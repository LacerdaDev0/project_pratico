import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

// Esta função vai buscar os dados reais no Firebase
export const getInstructorsFromFirebase = async () => {
  const instructorsCol = collection(db, 'instructors'); // Nome da coleção no Firestore
  const instructorSnapshot = await getDocs(instructorsCol);
  const instructorList = instructorSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  return instructorList;
};
