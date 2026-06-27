import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager, Firestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCTC4EC_6TsKOC0RfiAB9pwQcYq-ImF-yQ",
  authDomain: "ict-systems-project-a.firebaseapp.com",
  projectId: "ict-systems-project-a",
  storageBucket: "ict-systems-project-a.firebasestorage.app",
  messagingSenderId: "747967613386",
  appId: "1:747967613386:web:9c76a3009097c17de72733",
  measurementId: "G-Z6QDZS9TGC"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };