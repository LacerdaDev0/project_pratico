import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

const auth = getAuth();

export const registerUser = async (email: string, pass: string, name: string, role: 'aluno' | 'instrutor') => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;

    // Salva os dados extras (como se é aluno ou instrutor) no Firestore
    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: email,
      role: role,
      createdAt: new Date()
    });

    return user;
  } catch (error) {
    console.error("Erro no cadastro:", error);
    throw error;
  }
};
