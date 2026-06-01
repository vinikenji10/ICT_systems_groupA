import { useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

// Define the allowed institutional domain here
const ALLOWED_DOMAIN = '@shibaura-it.ac.jp'; 

// Add specific email addresses here to bypass the domain requirement
const ALLOWED_EMAILS = [
  'rne1111591@gmail.com',
];

export function useAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to check domain or explicit allowed emails
  const isValidDomain = (email: string | null) => {
    if (!email) return false;
    
    // Bypass for specific team members
    if (ALLOWED_EMAILS.includes(email.toLowerCase())) {
      return true;
    }
    
    return email.endsWith(ALLOWED_DOMAIN);
  };

  // Helper to ensure user document exists in Firestore
  const ensureUserDocument = async (firebaseUser: FirebaseUser) => {
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      const newUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
        role: 'student', 
        createdAt: serverTimestamp(),
      };
      await setDoc(userDocRef, newUser);
      setUserRole('student');
    } else {
      setUserRole(userDoc.data().role);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Double-check domain on session resume
        if (!isValidDomain(firebaseUser.email)) {
          await signOut(auth);
          setUser(null);
          setUserRole(null);
        } else {
          await ensureUserDocument(firebaseUser);
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    // Check domain immediately after Google login
    if (!isValidDomain(result.user.email)) {
      await signOut(auth);
      throw new Error(`Access denied. Please use your ${ALLOWED_DOMAIN} email.`);
    }
    
    await ensureUserDocument(result.user);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return { user, userRole, loading, loginWithGoogle, logout };
}
