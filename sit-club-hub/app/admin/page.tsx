"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, doc, updateDoc, arrayUnion, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/app/firebase/config';
import { useAuth } from '@/app/hooks/useAuth';
import { Club } from '@/app/types';
import { ADMIN_UIDS } from '@/app/utils/constants';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedClubId, setSelectedClubId] = useState('');
  const [studentUid, setStudentUid] = useState('');
  const [isPromoting, setIsPromoting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user || !ADMIN_UIDS.includes(user.uid)) {
      router.push('/');
      return;
    }

    const fetchAllClubs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'clubs'));
        const allClubs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Club[];
        
        setClubs(allClubs);
      } catch (error) {
        console.error("Error fetching all clubs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllClubs();
  }, [user, authLoading, router]);

  const handleCreateNewClub = async () => {
    if (!confirm("Create a new draft club? You will be redirected to edit its details.")) return;
    
    setIsCreating(true);
    try {
      const newClubDraft = {
        name_en: "New Club Draft",
        name_ja: "新しいクラブ",
        category: "General",
        tags: [],
        leaderIds: [], 
        status: "active",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'clubs'), newClubDraft);
      router.push(`/dashboard/edit/${docRef.id}`);
    } catch (error) {
      console.error("Error creating draft club:", error);
      alert("Failed to create new club.");
      setIsCreating(false);
    }
  };

  const handlePromoteLeader = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClubId || !studentUid.trim()) {
      alert("Please select a club and provide a valid Student UID.");
      return;
    }

    setIsPromoting(true);
    try {
      const clubRef = doc(db, 'clubs', selectedClubId);
      await updateDoc(clubRef, {
        leaderIds: arrayUnion(studentUid.trim())
      });

      const userRef = doc(db, 'users', studentUid.trim());
      await updateDoc(userRef, {
        role: 'leader'
      });

      alert(`Success! User ${studentUid} is now a leader of the selected club.`);
      setStudentUid(''); 
    } catch (error) {
      console.error("Error promoting leader:", error);
      alert("Failed to promote user. Check console for details.");
    } finally {
      setIsPromoting(false);
    }
  };

  if (authLoading || loading) {
    return <div className="text-center py-20 text-slate-500 font-medium">Verifying Admin Credentials...</div>;
  }

  if (!user || !ADMIN_UIDS.includes(user.uid)) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      <section className="bg-slate-900 p-8 rounded-xl shadow-lg border border-slate-800 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <span className="text-amber-400">👑</span> Central Admin Control
            </h1>
            <p className="text-slate-400">Global overview and management of the SIT Club Hub platform.</p>
          </div>
          <button 
            onClick={handleCreateNewClub}
            disabled={isCreating}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-800 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-sm"
          >
            {isCreating ? 'Creating...' : '+ Create New Club'}
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="font-bold text-xl text-dark border-b border-slate-100 pb-2 mb-4">
            Assign Club Leader
          </h2>
          <form onSubmit={handlePromoteLeader} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Target Club</label>
              <select 
                value={selectedClubId}
                onChange={(e) => setSelectedClubId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                required
              >
                <option value="" disabled>Select a club...</option>
                {clubs.map(c => (
                  <option key={c.id} value={c.id}>{c.name_en} ({c.category})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Student UID</label>
              <input 
                type="text" 
                value={studentUid}
                onChange={(e) => setStudentUid(e.target.value)}
                placeholder="Paste User ID here..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                required
              />
              <p className="text-xs text-slate-500 mt-1">Make sure you have the exact Firebase UID.</p>
            </div>
            <button 
              type="submit"
              disabled={isPromoting}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 px-4 rounded-lg mt-2 disabled:bg-slate-400 transition-colors"
            >
              {isPromoting ? 'Promoting...' : 'Promote & Link'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h2 className="font-bold text-xl text-dark">Global Club Directory</h2>
            <span className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
              {clubs.length} Total
            </span>
          </div>
          
          <ul className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {clubs.map((club) => (
              <li key={club.id} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-900">{club.name_en}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      {club.category}
                    </span>
                    <span className="text-xs text-slate-500">
                      ID: <span className="font-mono bg-slate-100 px-1 rounded">{club.id}</span>
                    </span>
                  </div>
                </div>
                
                {/* Updated Action Buttons Container */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => router.push(`/dashboard/events/${club.id}`)}
                    className="text-sm font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-lg transition-colors"
                  >
                    Events
                  </button>
                  <button 
                    onClick={() => router.push(`/dashboard/edit/${club.id}`)}
                    className="text-sm font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 px-4 py-2 rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}