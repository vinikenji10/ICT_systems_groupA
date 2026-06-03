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
  );
}
