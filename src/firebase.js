import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// The keys you provided from the screenshot
const firebaseConfig = {
  apiKey: "AIzaSyDDFsoHCo-g1_veZ1JKj820zcGAchwSfdA",
  authDomain: "speakup-7379c.firebaseapp.com",
  projectId: "speakup-7379c",
  storageBucket: "speakup-7379c.firebasestorage.app",
  messagingSenderId: "432882194974",
  appId: "1:432882194974:web:7f32edb05255aa3945ac0f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Authentication and Database so we can use it in App.jsx
export const auth = getAuth(app);
export const db = getFirestore(app);
