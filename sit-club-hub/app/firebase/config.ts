import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAu4Lv-_31RDxt-J0NWhhby-hQoxS7KSL4",
  authDomain: "ict-systems-project-a.firebaseapp.com",
  projectId: "ict-systems-project-a",
  storageBucket: "ict-systems-project-a.firebasestorage.app",
  messagingSenderId: "747967613386",
  appId: "1:747967613386:web:0ddc48f24949dfede72733",
  measurementId: "G-2GRVSSSJZD"
};

// Inicializa de forma segura para evitar erros com o Fast Refresh do Next.js
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };