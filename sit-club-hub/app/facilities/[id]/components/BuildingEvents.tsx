"use client";

import { useTranslation } from '@/app/contexts/useTranslation';
import { CampusEvent, Category } from '@/app/types';
import EventCard from '@/app/components/EventCard';

interface BuildingEventsProps {
  filteredEvents: CampusEvent[];
  categories: Category[];
}

export default function BuildingEvents({ filteredEvents, categories }: BuildingEventsProps) {
  const { lang } = useTranslation();

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8 space-y-6">
      <h3 className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
        <span>📅</span> {lang === 'ja' ? 'この校舎で開催予定のイベント' : 'Upcoming Events in this Building'}
      </h3>

      {filteredEvents.length === 0 ? (
        <div className="py-12 text-center bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-slate-500 font-bold text-sm italic">
            {lang === 'ja' ? '現在この校舎で予定されているイベントはありません。' : 'No upcoming events scheduled in this building.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((event) => {
            const matchedCategory = categories.find((c) => c.id === event.category);
            return (
              <EventCard
                key={event.id}
                event={event}
                category={matchedCategory}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
