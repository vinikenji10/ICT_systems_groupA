"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/config';
import { useTranslation } from '@/app/contexts/useTranslation';
import { Facility } from '@/app/types';
import DefaultButton from '@/app/components/DefaultButton';
import InfoCard from '@/app/components/InfoCard';
import { DEFAULT_BUILDINGS, DEFAULT_FACILITIES, Building } from '../page';

export default function BuildingDetails() {
  const router = useRouter();
  const params = useParams();
  const { t, lang } = useTranslation();
  const buildingId = params.id as string;

  const [building, setBuilding] = useState<Building | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const buildingRef = doc(db, 'buildings', buildingId);
        const buildingSnap = await getDoc(buildingRef);

        let buildingData: Building | null = null;
        if (buildingSnap.exists()) {
          buildingData = { id: buildingSnap.id, ...buildingSnap.data() } as Building;
        } else {
          const localB = DEFAULT_BUILDINGS.find((b) => b.id === buildingId);
          if (localB) buildingData = localB;
        }

        if (!buildingData) {
          router.push('/facilities');
          return;
        }
        setBuilding(buildingData);

        const snapshot = await getDocs(collection(db, 'facilities'));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Facility[];
        setFacilities(data);
      } catch (error) {
        console.error("Error fetching building or facilities details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [buildingId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d4f37] flex items-center justify-center text-white text-lg">
        {t('facilities.loading')}
      </div>
    );
  }

  if (!building) return null;

  // Filter Firestore facilities for this building
  const dbFacs = facilities.filter((f) => {
    const b = f.building.toLowerCase();
    if (building.campus === 'toyosu') {
      if (buildingId === 'toyosu-b1' && (b.includes('1') || b.includes('one') || b.includes('1号館'))) return true;
      if (buildingId === 'toyosu-b2' && (b.includes('2') || b.includes('two') || b.includes('2号館'))) return true;
      if (buildingId === 'toyosu-b3' && (b.includes('3') || b.includes('three') || b.includes('research') || b.includes('研究') || b.includes('3号館'))) return true;
    } else {
      if (buildingId === 'omiya-b2' && (b.includes('2') || b.includes('two') || b.includes('2号館'))) return true;
      if (buildingId === 'omiya-b5' && (b.includes('5') || b.includes('five') || b.includes('5号館'))) return true;
      if (buildingId === 'omiya-emergence' && (b.includes('emergence') || b.includes('創発'))) return true;
      if (buildingId === 'omiya-library' && (b.includes('library') || b.includes('図書'))) return true;
      if (buildingId === 'omiya-gym' && (b.includes('gym') || b.includes('体育'))) return true;
      if (buildingId === 'omiya-global-dorm' && (b.includes('global') || b.includes('国際'))) return true;
      if (buildingId === 'omiya-hakua-dorm' && (b.includes('hakua') || b.includes('白亜'))) return true;
    }
    return false;
  });

  const defaults = DEFAULT_FACILITIES[buildingId] || [];
  const mergedFacilities = [...defaults];
  dbFacs.forEach((f) => {
    if (!mergedFacilities.some((m) => m.id === f.id)) {
      mergedFacilities.push(f);
    }
  });

  return (
    <div className="min-h-screen bg-[#0d4f37] p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <div className="flex justify-start">
          <button
            onClick={() => router.push('/facilities')}
            className="text-white/80 hover:text-white flex items-center gap-2 text-sm font-bold transition-colors cursor-pointer"
          >
            ← {lang === 'ja' ? '施設案内一覧に戻る' : 'Back to Directory'}
          </button>
        </div>

        {/* Building Card (Similar to Club details layout) */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 flex flex-col">
          {/* Building Banner */}
          <div className="h-64 md:h-80 w-full bg-slate-200 relative overflow-hidden flex items-center justify-center shrink-0">
            {building.imageUrl ? (
              <img
                src={building.imageUrl}
                alt={`Banner photo of ${building.name_en}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-slate-400 font-medium">No Image Available</span>
            )}
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-xs font-black text-slate-800 shadow-md border border-slate-200/50 select-none">
              {building.campus === 'toyosu' ? t('facilities.toyosuCampus') : t('facilities.omiyaCampus')}
            </div>
          </div>

          {/* Details Content */}
          <div className="p-6 md:p-8 space-y-6">
            {/* Title & Stats */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200/50 px-2.5 py-1 rounded-md select-none">
                  {t('facilities.floors')}: {lang === 'ja' ? building.floors_ja : building.floors_en}
                </span>
                {building.established && (
                  <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200/50 px-2.5 py-1 rounded-md select-none">
                    {t('facilities.establishedYear')}: {building.established}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 leading-snug">
                {lang === 'ja' ? building.name_ja : building.name_en}
              </h1>
              {lang === 'en' && building.name_ja && (
                <h2 className="text-sm text-slate-400 font-bold mt-1">{building.name_ja}</h2>
              )}
            </div>

            {/* Description */}
            <div className="border-t border-slate-100 pt-5">
              <h3 className="font-extrabold text-base text-slate-900 mb-3">
                {lang === 'ja' ? '校舎について' : 'About the Building'}
              </h3>
              <p className="text-sm text-slate-650 leading-relaxed font-medium whitespace-pre-wrap">
                {lang === 'ja' ? building.description_ja : building.description_en}
              </p>
            </div>

            {/* Features Checklist */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
              <h4 className="font-extrabold text-[10px] text-slate-455 uppercase tracking-widest select-none">
                {t('facilities.features')}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm font-bold text-slate-700">
                {building.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-[#7bb93e] text-base select-none">✔</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rooms inside Building */}
            <div className="border-t border-slate-100 pt-6 space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <span>🏫</span> {t('facilities.roomsTitle')}
              </h3>

              {mergedFacilities.length === 0 ? (
                <p className="text-xs text-slate-500 font-bold italic py-4">
                  No active facilities registered in this building.
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {mergedFacilities.map((facility) => (
                    <InfoCard
                      key={facility.id}
                      imageUrl={facility.imageUrl}
                      imageAlt={lang === 'ja' ? facility.name_ja || '' : facility.name_en}
                      tags={facility.facilities}
                      categoryName={facility.building}
                      titleEn={facility.name_en}
                      titleJa={facility.name_ja}
                      details={[
                        { label: t('facilities.floor'), value: `${facility.floor}F` },
                        { label: t('facilities.room'), value: facility.roomNumber },
                        { label: t('facilities.hours'), value: lang === 'ja' ? facility.hours_ja : facility.hours_en }
                      ]}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
