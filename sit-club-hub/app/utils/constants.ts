import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/config';

let cachedUids: string[] | null = null;

export async function getAdminUids(): Promise<string[]> {
  if (cachedUids) return cachedUids;
  let result: string[] = [];
  try {
    const snap = await getDoc(doc(db, 'settings', 'admins'));
    if (snap.exists()) {
      result = snap.data().uids || [];
    }
  } catch {}
  cachedUids = result;
  return result;
}

export async function isAdmin(uid: string): Promise<boolean> {
  const uids = await getAdminUids();
  return uids.includes(uid);
}
