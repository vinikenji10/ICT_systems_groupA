"use client";

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/app/firebase/config';
import { useTranslation } from '@/app/contexts/useTranslation';
import { Facility } from '@/app/types';

export default function FacilitiesPage() {
  const { t, lang } = useTranslation();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'facilities'));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Facility[];
        setFacilities(data);
      } catch (error) {
        console.error("Error fetching facilities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-slate-500">{t('facilities.loading')}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <section className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-bold text-dark mb-2">{t('facilities.title')}</h1>
        <p className="text-slate-600">{t('facilities.subtitle')}</p>
      </section>

      {facilities.length === 0 ? (
        <div className="col-span-full py-12 text-center bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500 font-medium">{t('facilities.noFacilities')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility) => (
            <div key={facility.id} className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow border border-slate-100">
              {facility.imageUrl && (
                <div className="h-44 w-full bg-slate-100 overflow-hidden shrink-0">
                  <img
                    src={facility.imageUrl}
                    alt={lang === 'ja' ? facility.name_ja : facility.name_en}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-bold text-lg text-slate-900 mb-1">
                  {lang === 'ja' && facility.name_ja ? facility.name_ja : facility.name_en}
                </h3>
                {lang === 'en' && facility.name_ja && (
                  <p className="text-sm text-slate-400 mb-3">{facility.name_ja}</p>
                )}

                <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-grow">
                  {lang === 'ja' && facility.description_ja
                    ? facility.description_ja
                    : facility.description_en}
                </p>

                <div className="space-y-2 text-sm text-slate-600 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700 w-16">{t('facilities.building')}:</span>
                    <span>{facility.building}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700 w-16">{t('facilities.floor')}:</span>
                    <span>{facility.floor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700 w-16">{t('facilities.room')}:</span>
                    <span>{facility.roomNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700 w-16">{t('facilities.hours')}:</span>
                    <span>{lang === 'ja' ? facility.hours_ja : facility.hours_en}</span>
                  </div>
                </div>

                {facility.facilities && facility.facilities.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{t('facilities.amenities')}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {facility.facilities.map((item, idx) => (
                        <span key={idx} className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
