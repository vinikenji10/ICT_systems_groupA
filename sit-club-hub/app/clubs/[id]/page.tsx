"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '@/app/firebase/config';
import { useAuth } from '@/app/hooks/useAuth';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { useTranslation } from '@/app/contexts/useTranslation';
import { Club } from '@/app/types';

export default function ClubDetails() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const clubId = params.id as string;

  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { lang: displayLang, setLang: setDisplayLang } = useLanguage();
  const { t, tt } = useTranslation();

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
    return <div className="text-center py-20 text-slate-500">{t('club.loading')}</div>;
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
            <span className="text-slate-400 font-medium">{t('club.bannerPlaceholder')}</span>
          )}
        </div>
        
        <div className="p-8">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded-md mb-3 inline-block">
                {club.category}
              </span>
              <h1 className="text-3xl font-bold text-slate-900 mb-1">{displayLang === 'ja' && club.name_ja ? club.name_ja : club.name_en}</h1>
              {displayLang === 'en' && club.name_ja && (
                <h2 className="text-lg text-slate-500 font-medium">{club.name_ja}</h2>
              )}
            </div>

            <div className="text-right">
              {!hasApplied ? (
                <button 
                  onClick={handleApply}
                  disabled={isApplying}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-sm"
                >
                  {isApplying ? t('club.sending') : t('club.joinClub')}
                </button>
              ) : (
                <div className="inline-block border border-slate-200 bg-slate-50 px-6 py-3 rounded-lg text-left">
                  <p className="text-sm text-slate-500 mb-1">{t('club.applicationStatus')}</p>
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
                #{tt(tag)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h3 className="font-bold text-xl text-dark mb-4">{displayLang === 'en' ? t('club.aboutUs') : t('club.aboutUsJa')}</h3>
        <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
          {displayLang === 'en'
            ? (club.description_en || t('club.noDescription'))
            : (club.description_ja || t('club.noDescriptionJa'))}
        </p>
      </div>

      {/* Structured Information Section - AGORA DINÂMICA COM O IDIOMA */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h3 className="font-bold text-xl text-dark mb-6">{t('club.detailedInfo')}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 text-sm">
          
          <div className="flex flex-col md:flex-row py-3 border-b border-slate-100 gap-2 md:gap-4">
            <span className="font-bold text-dark md:w-32 shrink-0">{displayLang === 'en' ? t('club.activity') : t('club.activityJa')}</span>
            <span className="text-slate-600">{club[`activity_${displayLang}`] || '-'}</span>
          </div>
          
          <div className="flex flex-col md:flex-row py-3 border-b border-slate-100 gap-2 md:gap-4">
            <span className="font-bold text-dark md:w-32 shrink-0">{displayLang === 'en' ? t('club.level') : t('club.levelJa')}</span>
            <span className="text-slate-600">{club[`level_${displayLang}`] || '-'}</span>
          </div>

          <div className="flex flex-col md:flex-row py-3 border-b border-slate-100 gap-2 md:gap-4">
            <span className="font-bold text-dark md:w-32 shrink-0">{displayLang === 'en' ? t('club.schedule') : t('club.scheduleJa')}</span>
            <span className="text-slate-600">{club[`schedule_${displayLang}`] || '-'}</span>
          </div>

          <div className="flex flex-col md:flex-row py-3 border-b border-slate-100 gap-2 md:gap-4">
            <span className="font-bold text-dark md:w-32 shrink-0">{displayLang === 'en' ? t('club.scheduleInfo') : t('club.scheduleInfoJa')}</span>
            <span className="text-slate-600">{club[`scheduleInfo_${displayLang}`] || '-'}</span>
          </div>

          <div className="flex flex-col md:flex-row py-3 border-b border-slate-100 gap-2 md:gap-4">
            <span className="font-bold text-dark md:w-32 shrink-0">{displayLang === 'en' ? t('club.location') : t('club.locationJa')}</span>
            <span className="text-slate-600">{club[`location_${displayLang}`] || '-'}</span>
          </div>

          <div className="flex flex-col md:flex-row py-3 border-b border-slate-100 gap-2 md:gap-4">
            <span className="font-bold text-dark md:w-32 shrink-0">{displayLang === 'en' ? t('club.mainPlaces') : t('club.mainPlacesJa')}</span>
            <span className="text-slate-600">{club[`mainPlaces_${displayLang}`] || '-'}</span>
          </div>

          <div className="flex flex-col md:flex-row py-3 border-b border-slate-100 gap-2 md:gap-4">
            <span className="font-bold text-dark md:w-32 shrink-0">{displayLang === 'en' ? t('club.equipment') : t('club.equipmentJa')}</span>
            <span className="text-slate-600">{club[`equipment_${displayLang}`] || '-'}</span>
          </div>

          <div className="flex flex-col md:flex-row py-3 border-b border-slate-100 gap-2 md:gap-4">
            <span className="font-bold text-dark md:w-32 shrink-0">{displayLang === 'en' ? t('club.membershipFee') : t('club.membershipFeeJa')}</span>
            <span className="text-slate-600">{club[`membershipFee_${displayLang}`] || '-'}</span>
          </div>

          <div className="flex flex-col md:flex-row py-3 md:col-span-2 border-b border-slate-100 gap-2 md:gap-4">
            <span className="font-bold text-dark md:w-32 shrink-0">{displayLang === 'en' ? t('club.paymentInfo') : t('club.paymentInfoJa')}</span>
            <span className="text-slate-600">{club[`payment_${displayLang}`] || '-'}</span>
          </div>

        </div>
      </div>
    </div>
  );
}