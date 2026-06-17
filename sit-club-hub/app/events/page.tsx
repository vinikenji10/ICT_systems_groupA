"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/app/firebase/config';
import { useTranslation } from '@/app/contexts/useTranslation';
import { CampusEvent, Category } from '@/app/types';
import EventCard from '@/app/components/EventCard';

const EventsCalendar = dynamic(() => import('@/app/components/EventsCalendar'), {
  ssr: false,
  loading: () => <div className="text-center py-20 text-emerald-50 font-medium">Loading calendar...</div>
});

export default function CampusEvents() {
  const { t } = useTranslation();
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'list' | 'calendar'>('calendar');

  useEffect(() => {

    const fetchAllEvents = async () => {
      try {
        const [clubsSnapshot, categoriesSnapshot, eventsSnapshot] = await Promise.all([
          getDocs(collection(db, 'clubs')),
          getDocs(collection(db, 'categories')),
          getDocs(collection(db, 'events'))
        ]);
        
        const clubMap: Record<string, { name: string; category: string }> = {};
        clubsSnapshot.docs.forEach(doc => {
          const data = doc.data();
          clubMap[doc.id] = { 
            name: data.name_en, 
            category: data.category 
          };
        });

        const categoriesData = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Category[];
        setCategories(categoriesData);

        const allEventsData: CampusEvent[] = [];

        eventsSnapshot.docs.forEach(docSnap => {
          const data = docSnap.data();
          if (data.isPublic !== false && data.startTime && data.endTime) {
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
    <div className="relative w-full flex flex-col items-center max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Full bleed fixed background to break out of layout constraints */}
      <div className="fixed inset-0 bg-[#0d4f37] z-0 pointer-events-none" />
      


      <div className="relative z-10 w-full space-y-8 pb-8">
        <section className="bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{t('events.title')}</h1>
            <p className="text-slate-600 font-medium text-lg">{t('events.subtitle')}</p>
          </div>
        </section>

        {/* Dynamic switcher tabs */}
        <div className="flex justify-center">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-1.5 rounded-2xl flex gap-1.5 shadow-lg">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer ${
                activeTab === 'list'
                  ? 'bg-white text-[#0d4f37] shadow-md scale-102'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {t('events.tabList')}
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer ${
                activeTab === 'calendar'
                  ? 'bg-white text-[#0d4f37] shadow-md scale-102'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {t('events.tabCalendar')}
            </button>
          </div>
        </div>

        {activeTab === 'list' ? (
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
        ) : (
          <EventsCalendar events={events} categories={categories} />
        )}
      </div>
    </div>
  );
}
