import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDVigCAOxkpWRLpm5GKKQFPGFNfohT53rA0",
  authDomain: "pratico-app-24583.firebaseapp.com",
  projectId: "pratico-app-24583",
  storageBucket: "pratico-app-24583.firebasestorage.app",
  messagingSenderId: "387573346305",
  appId: "1:387573346305:web:39a436c6183386ed325000",
  measurementId: "G-B9RKS9PH8F"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
