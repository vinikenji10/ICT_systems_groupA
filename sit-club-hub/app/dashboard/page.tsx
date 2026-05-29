"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '@/app/contexts/useTranslation';
import { Club } from '@/app/types';

export default function LeaderDashboard() {
  const { user, userRole, loading: authLoading } = useAuth();
  const router = useRouter();
  const { t, lang } = useTranslation();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loadingClubs, setLoadingClubs] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user || userRole !== 'leader') {
      router.push('/');
      return;
    }

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

  if (authLoading || (user && userRole === 'leader' && loadingClubs)) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-slate-500 font-medium animate-pulse">{t('dashboard.loading')}</p>
      </div>
    );
  }

  if (!user || userRole !== 'leader') {
    return null; 
  }

  return (
    <div className="space-y-8">
      <section className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-bold text-dark mb-2">{t('dashboard.leaderPortal')}</h1>
        <p className="text-slate-600">{t('dashboard.subtitle')}</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs.length === 0 ? (
          <div className="col-span-full bg-slate-50 p-8 rounded-xl border border-slate-200 text-center">
            <p className="text-slate-500">{t('dashboard.noClubs')}</p>
            <p className="text-sm text-slate-400 mt-2">{t('dashboard.contactSupport')}</p>
          </div>
        ) : (
          clubs.map((club) => (
            <div key={club.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-md mb-2 inline-block">
                    {club.category}
                  </span>
                  <h3 className="font-bold text-xl text-slate-900 leading-tight">{lang === 'ja' && club.name_ja ? club.name_ja : club.name_en}</h3>
                  <p className="text-sm text-slate-500">{club.name_ja}</p>
                </div>
                <span className={`w-3 h-3 rounded-full ${club.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
              </div>
              
              <div className="mt-auto pt-6 flex gap-3">
                <button 
                  onClick={() => router.push(`/dashboard/edit/${club.id}`)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  {t('dashboard.editProfile')}
                </button>
                <button
                  onClick={() => router.push(`/dashboard/events/${club.id}`)}
                  className="flex-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  {t('dashboard.events')}
                </button>
                <button
                  onClick={() => router.push(`/dashboard/applications/${club.id}`)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  {t('dashboard.apps')}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}