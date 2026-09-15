import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBwRKTGZRS5njIv9WqS7thq2yQJe2Tg1GU",
  authDomain: "ksa-tattoo-studio.firebaseapp.com",
  projectId: "ksa-tattoo-studio",
  storageBucket: "ksa-tattoo-studio.firebasestorage.app",
  messagingSenderId: "114949402623",
  appId: "1:114949402623:web:c237313b61778cb79541ca",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);