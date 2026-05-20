"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config'; //
import { useAuth } from '../hooks/useAuth';

// Interface for the Club data model
interface Club {
  id: string;
  name_en: string;
  name_ja: string;
  category: string;
  status: string;
}

export default function LeaderDashboard() {
  const { user, userRole, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loadingClubs, setLoadingClubs] = useState(true);

  useEffect(() => {
    // If authentication is still loading, do nothing
    if (authLoading) return;

    // Redirect to home if user is not logged in or is not a leader
    if (!user || userRole !== 'leader') {
      router.push('/');
      return;
    }

    // Fetch only the clubs where the current user is a leader
    const fetchMyClubs = async () => {
      try {
        const clubsRef = collection(db, 'clubs');
        const q = query(clubsRef, where('leaderIds', 'array-contains', user.uid));
        const querySnapshot = await getDocs(q);
        
        const myClubs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Club[];
        
        setClubs(myClubs);
      } catch (error) {
        console.error("Error fetching leader's clubs:", error);
      } finally {
        setLoadingClubs(false);
      }
    };

    fetchMyClubs();
  }, [user, userRole, authLoading, router]);

  // Show a loading state while checking authentication
  if (authLoading || (user && userRole === 'leader' && loadingClubs)) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-slate-500 font-medium animate-pulse">Loading Dashboard...</p>
      </div>
    );
  }

  // Prevent rendering if not authorized (acts as a fallback before redirect)
  if (!user || userRole !== 'leader') {
    return null; 
  }

  return (
    <div className="space-y-8">
      <section className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Leader Portal</h1>
        <p className="text-slate-600">Manage your organizations, events, and member applications.</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs.length === 0 ? (
          <div className="col-span-full bg-slate-50 p-8 rounded-xl border border-slate-200 text-center">
            <p className="text-slate-500">You are not assigned as a leader to any clubs yet.</p>
            <p className="text-sm text-slate-400 mt-2">Contact SIT ICT to request access to your organization.</p>
          </div>
        ) : (
          clubs.map((club) => (
            <div key={club.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-md mb-2 inline-block">
                    {club.category}
                  </span>
                  <h3 className="font-bold text-xl text-slate-900 leading-tight">{club.name_en}</h3>
                  <p className="text-sm text-slate-500">{club.name_ja}</p>
                </div>
                <span className={`w-3 h-3 rounded-full ${club.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
              </div>
              
              <div className="mt-auto pt-6 flex gap-3">
                <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg text-sm font-semibold transition-colors">
                  Edit Profile
                </button>
                <button 
                onClick={() => router.push(`/dashboard/applications/${club.id}`)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                Manage Apps
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}