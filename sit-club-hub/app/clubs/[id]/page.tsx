"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '@/app/firebase/config';
import { useAuth } from '@/app/hooks/useAuth';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { useTranslation } from '@/app/contexts/useTranslation';
import { Club, Category } from '@/app/types';
import { getAdminUids } from '@/app/utils/constants';

import DefaultButton from '@/app/components/DefaultButton';

export default function ClubDetails() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const clubId = params.id as string;

  const [club, setClub] = useState<Club | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { lang: displayLang } = useLanguage();
  const { t, tt } = useTranslation();

  // Application states
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [adminUids, setAdminUids] = useState<string[]>([]);

  const hasEditPermission = !!(user && club && (
    adminUids.includes(user.uid) || 
    club.leaderIds?.includes(user.uid)
  ));

  useEffect(() => {
    const fetchClubAndCategories = async () => {
      try {
        const uids = await getAdminUids();
        setAdminUids(uids);

        const clubRef = doc(db, 'clubs', clubId);
        const clubSnap = await getDoc(clubRef);

        if (clubSnap.exists()) {
          setClub({ id: clubSnap.id, ...clubSnap.data() } as Club);
        } else {
          alert("Club not found.");
          router.push('/');
          return;
        }

        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const categoriesData = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Category[];
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching club details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClubAndCategories();
  }, [clubId, router]);

  const getLocalizedCategory = () => {
    if (!club) return '';
    const matched = categories.find(
      c => c.id === club.category
    );
    if (matched) {
      return displayLang === 'ja' && matched.name_ja ? matched.name_ja : matched.name_en;
    }
    return club.category;
  };

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

  const handleEditClick = () => {
    if (!user) {
      router.push('/login');
    } else if (club) {
      router.push(`/dashboard/edit/${club.id}`);
    }
  };

  if (loading || authLoading) {
    return <div className="text-center py-20 text-slate-500">{t('club.loading')}</div>;
  }

  if (!club) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
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
                {getLocalizedCategory()}
              </span>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-slate-900 leading-snug">
                  {displayLang === 'ja' && club.name_ja ? club.name_ja : club.name_en}
                </h1>
                {club.instagramUrl && (
                  <a 
                    href={club.instagramUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#e1306c] hover:text-[#c13584] transition-colors shrink-0"
                    aria-label="Instagram"
                  >
                    <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </a>
                )}
              </div>
              {displayLang === 'en' && club.name_ja && (
                <h2 className="text-lg text-slate-500 font-medium">{club.name_ja}</h2>
              )}
            </div>

            <div className="hidden md:block text-right shrink-0">
              {!hasApplied ? (
                <DefaultButton 
                  onClick={handleApply}
                  disabled={isApplying}
                  variant="blue"
                  className="px-6 rounded-lg"
                >
                  {isApplying ? t('club.sending') : t('club.joinClub')}
                </DefaultButton>
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

          <div className="block md:hidden mt-6">
            {!hasApplied ? (
              <DefaultButton 
                onClick={handleApply}
                disabled={isApplying}
                variant="blue"
                className="w-full py-3 px-6 rounded-lg"
              >
                {isApplying ? t('club.sending') : t('club.joinClub')}
              </DefaultButton>
            ) : (
              <div className="w-full border border-slate-200 bg-slate-50 px-6 py-3 rounded-lg text-left">
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

      {/* Edit this page button (Bottom-most section) */}
      <div className="flex justify-center pt-6 pb-4">
        <button
          onClick={handleEditClick}
          disabled={user ? !hasEditPermission : false}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
          <span>{t('club.editThisPage')}</span>
        </button>
      </div>
    </div>
  );
}
