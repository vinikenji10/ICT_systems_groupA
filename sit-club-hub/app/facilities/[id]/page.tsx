"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/config';
import { useTranslation } from '@/app/contexts/useTranslation';
import { CampusEvent, Category } from '@/app/types';
import { DEFAULT_BUILDINGS, Building } from '../page';
import BackButton from './components/BackButton';
import BuildingBanner from './components/BuildingBanner';
import BuildingHours from './components/BuildingHours';
import BuildingEvents from './components/BuildingEvents';

export default function BuildingDetails() {
  const router = useRouter();
  const params = useParams();
  const { t, lang } = useTranslation();
  const buildingId = params.id as string;

  const [building, setBuilding] = useState<Building | null>(null);
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
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

        // Fetch clubs to map club names and categories
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

        // Fetch categories for EventCard rendering
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const categoriesData = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Category[];
        setCategories(categoriesData);

        // Fetch events
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
        console.error("Error fetching building or events details:", error);
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

  const schedule = (() => {
    if (building.weekdays_ja && building.weekdays_en && building.hours_ja && building.hours_en) {
      return {
        weekdays: lang === 'ja' ? building.weekdays_ja : building.weekdays_en,
        hours: lang === 'ja' ? building.hours_ja : building.hours_en,
      };
    }

    // Fallbacks based on building ID
    if (buildingId.includes('library')) {
      return {
        weekdays: lang === 'ja' ? '月曜日 - 土曜日 (日祝は閉館)' : 'Monday - Saturday (Closed on Sundays/Holidays)',
        hours: lang === 'ja' ? '平日: 09:00 - 22:00 / 土曜: 09:00 - 17:00' : 'Weekdays: 09:00 - 22:00 / Saturdays: 09:00 - 17:00',
      };
    }
    if (buildingId.includes('gym')) {
      return {
        weekdays: lang === 'ja' ? '月曜日 - 土曜日' : 'Monday - Saturday',
        hours: lang === 'ja' ? '09:00 - 21:00' : '09:00 - 21:00',
      };
    }
    if (buildingId.includes('dorm')) {
      return {
        weekdays: lang === 'ja' ? '毎日 (入居者専用)' : 'Every day (Residents only)',
        hours: lang === 'ja' ? '24時間対応' : '24 Hours',
      };
    }

    // General building hours
    return {
      weekdays: lang === 'ja' ? '月曜日 - 金曜日 (土日祝は閉館)' : 'Monday - Friday (Closed on Weekends/Holidays)',
      hours: lang === 'ja' ? '08:30 - 20:00' : '08:30 - 20:00',
    };
  })();

  // Filter events matching the current building location
  const filteredEvents = events.filter((event) => {
    const loc = (event.location_en || event.location_ja || '').toLowerCase();
    
    // Check match for specific building IDs
    if (buildingId === 'toyosu-b1') {
      return loc.includes('building 1') || loc.includes('1号館') || loc.includes('b1') || loc.includes('one');
    }
    if (buildingId === 'toyosu-b2') {
      return loc.includes('building 2') || loc.includes('2号館') || loc.includes('b2') || loc.includes('two') || loc.includes('sicilia') || loc.includes('segafredo');
    }
    if (buildingId === 'toyosu-b3') {
      return loc.includes('building 3') || loc.includes('3号館') || loc.includes('b3') || loc.includes('three') || loc.includes('research') || loc.includes('kids park');
    }
    if (buildingId === 'omiya-b2') {
      return loc.includes('building 2') || loc.includes('2号館') || loc.includes('b2') || loc.includes('two') || loc.includes('glc');
    }
    if (buildingId === 'omiya-b5') {
      return loc.includes('building 5') || loc.includes('5号館') || loc.includes('b5') || loc.includes('five') || loc.includes('cafeteria') || loc.includes('購買');
    }
    if (buildingId === 'omiya-emergence') {
      return loc.includes('emergence') || loc.includes('創発');
    }
    if (buildingId === 'omiya-library') {
      return loc.includes('library') || loc.includes('図書館') || loc.includes('図書');
    }
    if (buildingId === 'omiya-gym') {
      return loc.includes('gym') || loc.includes('体育館') || loc.includes('体育') || loc.includes('グラウンド') || loc.includes('ground');
    }
    if (buildingId === 'omiya-global-dorm') {
      return loc.includes('global dormitory') || loc.includes('国際学生寮') || loc.includes('寮') || loc.includes('dorm');
    }
    if (buildingId === 'omiya-hakua-dorm') {
      return loc.includes('hakua') || loc.includes('白亜');
    }
    
    return false;
  });

  return (
    <div className="min-h-screen bg-[#0d4f37] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Back Button */}
        <BackButton />

        {/* 2-Column Grid Layout for Building Banner and Hours */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Building Card (spans 2 cols on lg) */}
          <div className="lg:col-span-2">
            <BuildingBanner building={building} />
          </div>

          {/* Right Column: Available Hours / Weekdays Card */}
          <BuildingHours building={building} schedule={schedule} />
        </div>

        {/* Events inside Building */}
        <BuildingEvents filteredEvents={filteredEvents} categories={categories} />
      </div>
    </div>
  );
}

