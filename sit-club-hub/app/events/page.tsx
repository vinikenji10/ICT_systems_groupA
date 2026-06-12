"use client";

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/app/firebase/config';
import { useTranslation } from '@/app/contexts/useTranslation';
import { CampusEvent, Category } from '@/app/types';
import EventCard from '@/app/components/EventCard';

export default function CampusEvents() {
  const { t } = useTranslation();
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
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

        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const categoriesData = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Category[];
        setCategories(categoriesData);

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
    return <div className="text-center py-20 text-emerald-50">{t('events.loading')}</div>;
  }

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Full bleed fixed background to break out of layout constraints */}
      <div className="fixed inset-0 bg-[#0d4f37] z-0 pointer-events-none" />
      


      <div className="relative z-10 w-full space-y-8 pb-8">
        <section className="bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{t('events.title')}</h1>
            <p className="text-slate-600 font-medium text-lg">{t('events.subtitle')}</p>
          </div>
        </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-xl border border-slate-200">
            <p className="text-slate-500 font-medium">{t('events.noEvents')}</p>
            <p className="text-sm text-slate-400 mt-1">{t('events.checkBack')}</p>
          </div>
        ) : (
          events.map((event) => {
            const matchedCategory = categories.find((c) => c.id === event.category);
            return (
              <EventCard
                key={event.id}
                event={event}
                category={matchedCategory}
              />
            );
          })
        )}
      </div>
      </div>
    </div>
  );
}
