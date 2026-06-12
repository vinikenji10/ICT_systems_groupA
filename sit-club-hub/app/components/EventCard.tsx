"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "@/app/contexts/useTranslation";
import { CampusEvent, Category } from "@/app/types";
import DefaultButton from "./DefaultButton";

interface EventCardProps {
  event: CampusEvent;
  category?: Category;
}

export default function EventCard({ event, category }: EventCardProps) {
  const router = useRouter();
  const { t, lang } = useTranslation();

  const dateString = event.startTime.toLocaleDateString(lang === 'ja' ? 'ja-JP' : 'en-US', { 
    month: 'short', day: 'numeric', year: 'numeric' 
  });
  
  const timeString = `${event.startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${event.endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;

  const categoryName = category
    ? (lang === 'ja' && category.name_ja ? category.name_ja : category.name_en)
    : event.category;

  const eventTitle = lang === 'ja' && event.title_ja ? event.title_ja : event.title_en;
  const eventLocation = lang === 'ja' && event.location_ja ? event.location_ja : event.location_en;

  return (
    <div className="bg-white/80 backdrop-blur-md border border-white/30 rounded-3xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:bg-white/90">
      <div className="bg-primary/90 backdrop-blur-sm text-white px-5 py-3 flex justify-between items-center border-b border-white/20">
        <span className="font-bold tracking-wide">{dateString}</span>
        <span className="text-sm font-medium bg-white/20 px-2 py-0.5 rounded text-white">
          {categoryName}
        </span>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-xl text-slate-900 mb-1">{eventTitle}</h3>
        {lang === 'en' && event.title_ja && (
          <p className="text-sm text-slate-500 mb-4">{event.title_ja}</p>
        )}
        
        <div className="space-y-2 mt-auto mb-6">
          <div className="flex items-center text-sm text-slate-600">
            <span className="w-5 font-bold">🕒</span>
            <span>{timeString}</span>
          </div>
          <div className="flex items-center text-sm text-slate-600">
            <span className="w-5 font-bold">📍</span>
            <span>{eventLocation}</span>
          </div>
          <div className="flex items-center text-sm text-slate-600">
            <span className="w-5 font-bold">🏢</span>
            <span 
              className="font-medium text-primary hover:underline cursor-pointer" 
              onClick={() => router.push(`/club?id=${event.clubId}`)}
            >
              {event.clubName}
            </span>
          </div>
        </div>

        <DefaultButton 
          onClick={() => router.push(`/club?id=${event.clubId}`)}
          variant="light"
          className="w-full mt-auto rounded-lg text-sm py-2.5 font-semibold"
        >
          {t('events.viewClub')}
        </DefaultButton>
      </div>
    </div>
  );
}
