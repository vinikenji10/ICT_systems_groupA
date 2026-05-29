"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '@/app/firebase/config';
import { useAuth } from '@/app/hooks/useAuth';
import { Club } from '@/app/types';

export default function ClubDetails() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const clubId = params.id as string;

  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Estado local temporário para a tabela de detalhes bilingue
  const [displayLang, setDisplayLang] = useState<'en' | 'ja'>('en');

  // Application states
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const clubRef = doc(db, 'clubs', clubId);
        const clubSnap = await getDoc(clubRef);

        if (clubSnap.exists()) {
          setClub({ id: clubSnap.id, ...clubSnap.data() } as Club);
        } else {
          alert("Club not found.");
          router.push('/');
        }
      } catch (error) {
        console.error("Error fetching club details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClub();
  }, [clubId, router]);

  useEffect(() => {
    if (!user || authLoading) return;

    const checkApplicationStatus = async () => {
      try {
        const appsRef = collection(db, 'applications');
        const q = query(
          appsRef, 
          where('clubId', '==', clubId),
          where('studentId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setHasApplied(true);
          setApplicationStatus(querySnapshot.docs[0].data().status);
        }
      } catch (error) {
        console.error("Error checking application status:", error);
      }
    };

    checkApplicationStatus();
  }, [user, authLoading, clubId]);

  const handleApply = async () => {
    if (!user) {
      alert("Please sign in to apply to this club.");
      return;
    }
    setIsApplying(true);
    try {
      const appsRef = collection(db, 'applications');
      await addDoc(appsRef, {
        clubId: clubId,
        studentId: user.uid,
        status: 'pending',
        message: 'I am interested in joining this club!',
        appliedAt: serverTimestamp()
      });

      setHasApplied(true);
      setApplicationStatus('pending');
      alert("Application sent successfully!");
    } catch (error) {
      console.error("Error sending application:", error);
      alert("Failed to send application. Please try again.");
    } finally {
      setIsApplying(false);
    }
  };

  if (loading || authLoading) {
    return <div className="text-center py-20 text-slate-500">Loading club details...</div>;
  }

  if (!club) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="h-64 w-full bg-slate-200 relative overflow-hidden flex items-center justify-center">
          {club.logoUrl ? (
            <img
              src={club.logoUrl}
              alt={`Banner of ${club.name_en}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-slate-400 font-medium">Banner Image Placeholder</span>
          )}
        </div>
        
        <div className="p-8">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded-md mb-3 inline-block">
                {club.category}
              </span>
              <h1 className="text-3xl font-bold text-slate-900 mb-1">{club.name_en}</h1>
              <h2 className="text-lg text-slate-500 font-medium">{club.name_ja}</h2>
            </div>

            <div className="text-right">
              {!hasApplied ? (
                <button 
                  onClick={handleApply}
                  disabled={isApplying}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-sm"
                >
                  {isApplying ? 'Sending...' : 'Join Club (Apply)'}
                </button>
              ) : (
                <div className="inline-block border border-slate-200 bg-slate-50 px-6 py-3 rounded-lg text-left">
                  <p className="text-sm text-slate-500 mb-1">Application Status</p>
                  <p className={`font-bold capitalize
                    ${applicationStatus === 'pending' ? 'text-amber-600' : 
                      applicationStatus === 'approved' ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {applicationStatus}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-6">
            {club.tags?.map((tag, idx) => (
              <span key={idx} className="text-sm font-medium bg-slate-100 text-slate-600 px-3 py-1 rounded-md border border-slate-200">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-xl text-slate-800 mb-4">About Us</h3>
          <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
            {club.description_en || "No description provided."}
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-xl text-slate-800 mb-4">クラブについて</h3>
          <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
            {club.description_ja || "詳細はありません。"}
          </p>
        </div>
      </div>

      {/* Structured Information Section - AGORA DINÂMICA COM O IDIOMA */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-xl text-slate-800">Detailed Information</h3>
          
          {/* Seletor de Idioma Local */}
          <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setDisplayLang('en')} 
              className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${displayLang === 'en' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              EN
            </button>
            <button 
              onClick={() => setDisplayLang('ja')} 
              className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${displayLang === 'ja' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              日本語
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 text-sm">
          
          <div className="flex flex-col md:flex-row py-3 border-b border-slate-100 gap-2 md:gap-4">
            <span className="font-bold text-slate-800 md:w-32 shrink-0">{displayLang === 'en' ? 'Activity' : '活動内容'}</span>
            <span className="text-slate-600">{club[`activity_${displayLang}`] || '-'}</span>
          </div>
          
          <div className="flex flex-col md:flex-row py-3 border-b border-slate-100 gap-2 md:gap-4">
            <span className="font-bold text-slate-800 md:w-32 shrink-0">{displayLang === 'en' ? 'Level' : 'レベル'}</span>
            <span className="text-slate-600">{club[`level_${displayLang}`] || '-'}</span>
          </div>

          <div className="flex flex-col md:flex-row py-3 border-b border-slate-100 gap-2 md:gap-4">
            <span className="font-bold text-slate-800 md:w-32 shrink-0">{displayLang === 'en' ? 'Schedule' : '活動日時'}</span>
            <span className="text-slate-600">{club[`schedule_${displayLang}`] || '-'}</span>
          </div>

          <div className="flex flex-col md:flex-row py-3 border-b border-slate-100 gap-2 md:gap-4">
            <span className="font-bold text-slate-800 md:w-32 shrink-0">{displayLang === 'en' ? 'Schedule Info' : '予定の詳細'}</span>
            <span className="text-slate-600">{club[`scheduleInfo_${displayLang}`] || '-'}</span>
          </div>

          <div className="flex flex-col md:flex-row py-3 border-b border-slate-100 gap-2 md:gap-4">
            <span className="font-bold text-slate-800 md:w-32 shrink-0">{displayLang === 'en' ? 'Location' : '活動場所'}</span>
            <span className="text-slate-600">{club[`location_${displayLang}`] || '-'}</span>
          </div>

          <div className="flex flex-col md:flex-row py-3 border-b border-slate-100 gap-2 md:gap-4">
            <span className="font-bold text-slate-800 md:w-32 shrink-0">{displayLang === 'en' ? 'Main Places' : '主な場所'}</span>
            <span className="text-slate-600">{club[`mainPlaces_${displayLang}`] || '-'}</span>
          </div>

          <div className="flex flex-col md:flex-row py-3 border-b border-slate-100 gap-2 md:gap-4">
            <span className="font-bold text-slate-800 md:w-32 shrink-0">{displayLang === 'en' ? 'Equipment' : '必要なもの'}</span>
            <span className="text-slate-600">{club[`equipment_${displayLang}`] || '-'}</span>
          </div>

          <div className="flex flex-col md:flex-row py-3 border-b border-slate-100 gap-2 md:gap-4">
            <span className="font-bold text-slate-800 md:w-32 shrink-0">{displayLang === 'en' ? 'Membership Fee' : '部費'}</span>
            <span className="text-slate-600">{club[`membershipFee_${displayLang}`] || '-'}</span>
          </div>

          <div className="flex flex-col md:flex-row py-3 md:col-span-2 border-b border-slate-100 gap-2 md:gap-4">
            <span className="font-bold text-slate-800 md:w-32 shrink-0">{displayLang === 'en' ? 'Payment Info' : '支払いについて'}</span>
            <span className="text-slate-600">{club[`payment_${displayLang}`] || '-'}</span>
          </div>

        </div>
      </div>
    </div>
  );
}