"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { collection, query, where, getDocs, doc, getDoc, addDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/app/firebase/config';
import { useAuth } from '@/app/hooks/useAuth';
import { ClubEvent } from '@/app/types';
import { ADMIN_UIDS } from '@/app/utils/constants'; // Importing the master key array

export default function ManageEvents() {
  const { user, userRole, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const clubId = params.id as string; 
  
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [clubName, setClubName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Form states for creating a new event
  const [titleEn, setTitleEn] = useState('');
  const [titleJa, setTitleJa] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionJa, setDescriptionJa] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [locationEn, setLocationEn] = useState('');
  const [locationJa, setLocationJa] = useState('');

  useEffect(() => {
    if (authLoading) return;

    // Security block: Allow access if the user is a leader OR an admin
    if (!user || (userRole !== 'leader' && !ADMIN_UIDS.includes(user.uid))) {
      router.push('/');
      return;
    }

    const fetchEventsAndClub = async () => {
      try {
        const clubRef = doc(db, 'clubs', clubId);
        const clubSnap = await getDoc(clubRef);
        
        // Check if the user is authorized to manage this specific club
        // Block ONLY if the user is neither a leader of this club NOR an admin
        if (!clubSnap.exists() || (!clubSnap.data().leaderIds?.includes(user.uid) && !ADMIN_UIDS.includes(user.uid))) {
          alert("You are not authorized to manage events for this club.");
          router.push('/dashboard');
          return;
        }
        
        setClubName(clubSnap.data().name_en);

        // Fetch existing events for this club
        const eventsRef = collection(db, 'events');
        const q = query(eventsRef, where('clubId', '==', clubId));
        const querySnapshot = await getDocs(q);
        
        const eventsData = querySnapshot.docs.map(docSnap => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            ...data,
            startTime: data.startTime.toDate(),
            endTime: data.endTime.toDate(),
          } as ClubEvent;
        });

        // Sort events chronologically (closest dates first)
        eventsData.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventsAndClub();
  }, [user, userRole, authLoading, clubId, router]);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const newEvent = {
        clubId,
        title_en: titleEn,
        title_ja: titleJa,
        description_en: descriptionEn,
        description_ja: descriptionJa,
        startTime: Timestamp.fromDate(new Date(startTime)),
        endTime: Timestamp.fromDate(new Date(endTime)),
        location_en: locationEn,
        location_ja: locationJa,
        isPublic: true
      };

      const docRef = await addDoc(collection(db, 'events'), newEvent);
      
      // Update local state to show the new event immediately
      setEvents([...events, { ...newEvent, id: docRef.id, startTime: new Date(startTime), endTime: new Date(endTime) }].sort((a, b) => a.startTime.getTime() - b.startTime.getTime()));
      
      // Reset form fields
      setTitleEn(''); setTitleJa(''); setDescriptionEn(''); setDescriptionJa('');
      setStartTime(''); setEndTime(''); setLocationEn(''); setLocationJa('');
      
      alert("Event added successfully!");
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Failed to add event.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteDoc(doc(db, 'events', eventId));
      setEvents(events.filter(e => e.id !== eventId));
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event.");
    }
  };

  if (loading || authLoading) {
    return <div className="text-center py-20 text-slate-500">Loading events...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Manage Events</h1>
          <p className="text-slate-600 mt-1">Schedule practices and meetings for {clubName}</p>
        </div>
        <button onClick={() => router.push('/dashboard')} className="text-slate-500 hover:text-slate-800 font-medium">
          &larr; Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Event Creation Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
          <h2 className="font-bold text-xl text-slate-800 mb-4">Create Event</h2>
          <form onSubmit={handleAddEvent} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Title (EN)</label>
              <input type="text" required value={titleEn} onChange={e => setTitleEn(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Title (JA)</label>
              <input type="text" required value={titleJa} onChange={e => setTitleJa(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Location (EN)</label>
              <input type="text" required value={locationEn} onChange={e => setLocationEn(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Location (JA)</label>
              <input type="text" required value={locationJa} onChange={e => setLocationJa(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Start</label>
                <input type="datetime-local" required value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">End</label>
                <input type="datetime-local" required value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
              </div>
            </div>
            <button type="submit" disabled={isSaving} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mt-4 disabled:bg-blue-300 transition-colors">
              {isSaving ? 'Saving...' : 'Add Event'}
            </button>
          </form>
        </div>

        {/* Scheduled Events List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-bold text-xl text-slate-800 mb-4">Upcoming Schedule</h2>
          {events.length === 0 ? (
            <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 text-center text-slate-500">
              No events scheduled yet.
            </div>
          ) : (
            events.map(event => (
              <div key={event.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{event.title_en}</h3>
                  <p className="text-sm text-slate-500">{event.location_en}</p>
                  <p className="text-xs text-slate-400 mt-1 font-medium text-blue-600">
                    {event.startTime.toLocaleString()} - {event.endTime.toLocaleString()}
                  </p>
                </div>
                <button onClick={() => handleDeleteEvent(event.id)} className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors">
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}