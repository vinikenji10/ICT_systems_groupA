"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/app/firebase/config';
import { useTranslation } from '@/app/contexts/useTranslation';
import { CampusEvent } from '@/app/types';

export default function CampusEvents() {
  const router = useRouter();
  const { t, lang } = useTranslation();
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const clubsRef = collection(db, 'clubs');
        const clubsSnapshot = await getDocs(clubsRef);
        
        const clubMap: Record<string, { name: string; category: string }> = {};
        clubsSnapshot.docs.forEach(doc => {
          const data = doc.data();
          clubMap[doc.id] = { 
            name: data.name_en, 
            category: data.category 
          };
        });

        const eventsRef = collection(db, 'events');
        const eventsSnapshot = await getDocs(eventsRef);

        const allEventsData: CampusEvent[] = [];

        eventsSnapshot.docs.forEach(docSnap => {
          const data = docSnap.data();
          if (data.isPublic !== false) {
            allEventsData.push({
              id: docSnap.id,
              clubId: data.clubId,
              clubName: clubMap[data.clubId]?.name || 'Unknown Club',
              category: clubMap[data.clubId]?.category || 'General',
              title_en: data.title_en,
              title_ja: data.title_ja,
              // Fallback para suportar o formato antigo caso o banco não tenha sido atualizado ainda
              location_en: data.location_en || data.location || 'TBD',
              location_ja: data.location_ja || data.location || 'TBD',
              startTime: data.startTime.toDate(),
              endTime: data.endTime.toDate(),
            });
          }
        });

        allEventsData.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
        setEvents(allEventsData);
      } catch (error) {
        console.error("Error fetching campus events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllEvents();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-slate-500">{t('events.loading')}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <section className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-bold text-dark mb-2">{t('events.title')}</h1>
        <p className="text-slate-600">{t('events.subtitle')}</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-xl border border-slate-200">
            <p className="text-slate-500 font-medium">{t('events.noEvents')}</p>
            <p className="text-sm text-slate-400 mt-1">{t('events.checkBack')}</p>
          </div>
        ) : (
          events.map((event) => {
            const dateString = event.startTime.toLocaleDateString(lang === 'ja' ? 'ja-JP' : 'en-US', { 
              month: 'short', day: 'numeric', year: 'numeric' 
            });
            const timeString = `${event.startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${event.endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;

            return (
              <div key={event.id} className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                <div className="bg-primary text-white px-5 py-3 flex justify-between items-center">
                  <span className="font-bold tracking-wide">{dateString}</span>
                  <span className="text-sm font-medium bg-white/20 px-2 py-0.5 rounded text-white">
                    {event.category}
                  </span>
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-bold text-xl text-slate-900 mb-1">{lang === 'ja' && event.title_ja ? event.title_ja : event.title_en}</h3>
                  {lang === 'en' && event.title_ja && (
                    <p className="text-sm text-slate-500 mb-4">{event.title_ja}</p>
                  )}
                  
                  <div className="space-y-2 mt-auto mb-6">
                    <div className="flex items-center text-sm text-slate-600">
                      <span className="w-5 font-bold">🕒</span>
                      <span>{timeString}</span>
                    </div>
                    {/* Renderização em Inglês por predefinição nesta página pública */}
                    <div className="flex items-center text-sm text-slate-600">
                      <span className="w-5 font-bold">📍</span>
                      <span>{lang === 'ja' && event.location_ja ? event.location_ja : event.location_en}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <span className="w-5 font-bold">🏢</span>
                      <span className="font-medium text-primary hover:underline cursor-pointer" onClick={() => router.push(`/clubs/${event.clubId}`)}>
                        {event.clubName}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => router.push(`/clubs/${event.clubId}`)}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-dark font-semibold py-2.5 rounded-lg transition-colors mt-auto text-sm"
                  >
                    {t('events.viewClub')}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
