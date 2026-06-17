"use client";

import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import jaLocale from '@fullcalendar/core/locales/ja';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/app/contexts/useTranslation';
import { CampusEvent, Category } from '@/app/types';
import DefaultButton from './DefaultButton';

interface EventsCalendarProps {
  events: CampusEvent[];
  categories: Category[];
}

export default function EventsCalendar({ events, categories }: EventsCalendarProps) {
  const router = useRouter();
  const { t, lang } = useTranslation();
  const [selectedEvent, setSelectedEvent] = useState<CampusEvent | null>(null);

  // Helper to color-code events based on category
  const getCategoryColors = (categoryId: string) => {
    switch (categoryId.toLowerCase()) {
      case 'engineering':
        return { bg: '#2563eb', border: '#1d4ed8', text: '#ffffff' }; // blue
      case 'esports':
        return { bg: '#9333ea', border: '#7e22ce', text: '#ffffff' }; // purple
      case 'sports':
        return { bg: '#ea580c', border: '#c2410c', text: '#ffffff' }; // orange
      case 'cultural':
        return { bg: '#db2777', border: '#be185d', text: '#ffffff' }; // pink
      case 'design':
        return { bg: '#0d9488', border: '#0f766e', text: '#ffffff' }; // teal
      default:
        return { bg: '#0f4e3c', border: '#0d3c2e', text: '#ffffff' }; // SIT emerald
    }
  };

  const getCategoryName = (categoryId: string) => {
    const matched = categories.find(c => c.id === categoryId);
    if (matched) {
      return lang === 'ja' && matched.name_ja ? matched.name_ja : matched.name_en;
    }
    return categoryId;
  };

  // Convert CampusEvents to FullCalendar event format
  const calendarEvents = events.map(event => {
    const colors = getCategoryColors(event.category);
    return {
      id: event.id,
      title: lang === 'ja' && event.title_ja ? event.title_ja : event.title_en,
      start: event.startTime,
      end: event.endTime,
      backgroundColor: colors.bg,
      borderColor: colors.border,
      textColor: colors.text,
      extendedProps: {
        eventObj: event
      }
    };
  });

  const handleEventClick = (clickInfo: any) => {
    const eventObj = clickInfo.event.extendedProps.eventObj as CampusEvent;
    if (eventObj) {
      setSelectedEvent(eventObj);
    }
  };

  // Localized date strings for the details modal
  const getModalDateStrings = (event: CampusEvent) => {
    const dateString = event.startTime.toLocaleDateString(lang === 'ja' ? 'ja-JP' : 'en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
    });
    const startTimeString = event.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endTimeString = event.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return { dateString, timeString: `${startTimeString} - ${endTimeString}` };
  };

  const modalDetails = selectedEvent ? getModalDateStrings(selectedEvent) : null;
  const matchedCategory = selectedEvent ? categories.find(c => c.id === selectedEvent.category) : null;
  const categoryColor = selectedEvent ? getCategoryColors(selectedEvent.category) : null;

  return (
    <div className="w-full relative">
      {/* Calendar Overrides CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        .fc {
          --fc-border-color: rgba(226, 232, 240, 0.8);
          --fc-daygrid-event-dot-width: 8px;
          --fc-page-bg-color: transparent;
          font-family: inherit;
        }
        
        /* Header Toolbar customizations */
        .fc .fc-toolbar {
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 1.5rem;
        }
        .fc .fc-toolbar-title {
          font-size: 1.5rem !important;
          font-weight: 800 !important;
          color: #0f4e3c !important;
        }
        .fc .fc-button-primary {
          background-color: #ffffff !important;
          border-color: #e2e8f0 !important;
          color: #0f4e3c !important;
          font-weight: 600 !important;
          padding: 0.5rem 1rem !important;
          border-radius: 0.75rem !important;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .fc .fc-button-primary:hover {
          background-color: #f8fafc !important;
          border-color: #cbd5e1 !important;
          color: #7bb93e !important;
        }
        .fc .fc-button-active {
          background-color: #0f4e3c !important;
          border-color: #0f4e3c !important;
          color: #ffffff !important;
        }
        .fc .fc-today-button {
          background-color: #7bb93e !important;
          border-color: #7bb93e !important;
          color: #ffffff !important;
        }
        .fc .fc-today-button:hover {
          background-color: #6da334 !important;
          border-color: #6da334 !important;
          color: #ffffff !important;
        }
        .fc .fc-today-button:disabled {
          background-color: #a3d96c !important;
          border-color: #a3d96c !important;
          opacity: 0.8;
        }

        /* View customization */
        .fc .fc-dayGridMonth-view,
        .fc .fc-timeGridWeek-view,
        .fc .fc-timeGridDay-view {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 1.5rem;
          overflow: hidden;
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .fc-theme-standard td, .fc-theme-standard th {
          border: 1px solid rgba(226, 232, 240, 0.8) !important;
        }
        .fc .fc-col-header-cell {
          background-color: #f8fafc;
          padding: 10px 0 !important;
        }
        .fc .fc-col-header-cell-cushion {
          color: #475569 !important;
          font-weight: 700 !important;
          text-decoration: none !important;
        }
        .fc .fc-daygrid-day-number {
          color: #334155 !important;
          font-weight: 600 !important;
          text-decoration: none !important;
          padding: 8px !important;
        }
        .fc .fc-day-today {
          background-color: rgba(123, 185, 62, 0.1) !important;
        }
        .fc .fc-day-today .fc-daygrid-day-number {
          color: #0f4e3c !important;
          font-weight: 800 !important;
        }

        /* Event styles */
        .fc-v-event, .fc-h-event {
          border-radius: 0.5rem !important;
          padding: 2px 6px !important;
          font-size: 0.825rem !important;
          font-weight: 600 !important;
          border: none !important;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          cursor: pointer;
          transition: transform 0.15s ease, filter 0.15s ease;
        }
        .fc-v-event:hover, .fc-h-event:hover {
          transform: translateY(-1px);
          filter: brightness(0.92);
        }
        .fc-daygrid-event {
          margin-top: 3px !important;
          margin-bottom: 3px !important;
        }
        
        /* Time grid and Day views scroll bar */
        .fc .fc-scroller-className {
          scrollbar-width: thin;
        }
      `}} />

      <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={calendarEvents}
          eventClick={handleEventClick}
          locales={[jaLocale]}
          locale={lang === 'ja' ? 'ja' : 'en'}
          firstDay={1} // Monday
          height="auto"
          editable={false}
          selectable={false}
        />
      </div>

      {/* Event Details Modal */}
      {selectedEvent && modalDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSelectedEvent(null)}
          />
          
          {/* Modal Card */}
          <div className="relative bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/80 shadow-2xl max-w-lg w-full overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Colored Category Bar */}
            <div 
              className="h-3 w-full" 
              style={{ backgroundColor: categoryColor?.bg }}
            />

            <div className="p-6 sm:p-8 space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2">
                  <span 
                    className="text-xs font-bold px-3 py-1 rounded-full text-white inline-block shadow-sm"
                    style={{ backgroundColor: categoryColor?.bg }}
                  >
                    {getCategoryName(selectedEvent.category)}
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900 leading-tight">
                    {lang === 'ja' && selectedEvent.title_ja ? selectedEvent.title_ja : selectedEvent.title_en}
                  </h3>
                  {lang === 'en' && selectedEvent.title_ja && (
                    <p className="text-sm text-slate-500">{selectedEvent.title_ja}</p>
                  )}
                </div>
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100"
                  aria-label="Close details"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Information List */}
              <div className="space-y-4 border-y border-slate-100 py-5">
                {/* Date & Time */}
                <div className="flex items-start gap-3 text-slate-700">
                  <span className="text-xl leading-none select-none">🕒</span>
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('events.dateTime')}</p>
                    <p className="font-semibold text-slate-800">{modalDetails.dateString}</p>
                    <p className="text-sm font-medium text-slate-500">{modalDetails.timeString}</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3 text-slate-700">
                  <span className="text-xl leading-none select-none">📍</span>
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('events.location')}</p>
                    <p className="font-semibold text-slate-800">
                      {lang === 'ja' && selectedEvent.location_ja ? selectedEvent.location_ja : selectedEvent.location_en}
                    </p>
                  </div>
                </div>

                {/* Organizer */}
                <div className="flex items-start gap-3 text-slate-700">
                  <span className="text-xl leading-none select-none">🏢</span>
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('events.club')}</p>
                    <button 
                      onClick={() => {
                        setSelectedEvent(null);
                        router.push(`/club?id=${selectedEvent.clubId}`);
                      }}
                      className="font-bold text-[#0f4e3c] hover:text-[#7bb93e] hover:underline text-left transition-colors"
                    >
                      {selectedEvent.clubName}
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <DefaultButton
                  onClick={() => setSelectedEvent(null)}
                  variant="outline"
                  className="flex-1 rounded-xl text-sm font-bold py-3"
                >
                  {t('events.close')}
                </DefaultButton>
                <DefaultButton
                  onClick={() => {
                    setSelectedEvent(null);
                    router.push(`/club?id=${selectedEvent.clubId}`);
                  }}
                  variant="primary"
                  className="flex-1 rounded-xl text-sm font-bold py-3 text-white"
                >
                  {t('events.viewClub')}
                </DefaultButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
