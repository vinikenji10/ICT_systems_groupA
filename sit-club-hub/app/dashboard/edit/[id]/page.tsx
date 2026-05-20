"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/config'; // Adjust the import path if necessary
import { useAuth } from '@/app/hooks/useAuth';

export default function EditClub() {
  const { user, userRole, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const clubId = params.id as string;

  // Form states
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionJa, setDescriptionJa] = useState('');
  const [lineLink, setLineLink] = useState('');
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [clubName, setClubName] = useState('');

  useEffect(() => {
    if (authLoading) return;

    // Block access if not a leader
    if (!user || userRole !== 'leader') {
      router.push('/');
      return;
    }

    const fetchClubData = async () => {
      try {
        const clubRef = doc(db, 'clubs', clubId);
        const clubSnap = await getDoc(clubRef);

        if (clubSnap.exists()) {
          const data = clubSnap.data();
          
          // Double check: ensure the current user is actually a leader of this specific club
          if (!data.leaderIds?.includes(user.uid)) {
            alert("You are not authorized to edit this club.");
            router.push('/dashboard');
            return;
          }

          setClubName(data.name_en);
          setDescriptionEn(data.description_en || '');
          setDescriptionJa(data.description_ja || '');

          // Fetch the private LINE link from the secure subcollection
          const linkRef = doc(db, 'clubs', clubId, 'privateData', 'links');
          const linkSnap = await getDoc(linkRef);
          if (linkSnap.exists()) {
            setLineLink(linkSnap.data().lineGroupLink || '');
          }
        } else {
          alert("Club not found.");
          router.push('/dashboard');
        }
      } catch (error) {
        console.error("Error fetching club details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClubData();
  }, [user, userRole, authLoading, clubId, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // 1. Update public club data
      const clubRef = doc(db, 'clubs', clubId);
      await updateDoc(clubRef, {
        description_en: descriptionEn,
        description_ja: descriptionJa,
        updatedAt: new Date() // Keeping track of updates
      });

      // 2. Update private LINE link securely
      // Using setDoc with merge to create the document if it doesn't exist
      const linkRef = doc(db, 'clubs', clubId, 'privateData', 'links');
      await updateDoc(linkRef, {
        lineGroupLink: lineLink
      }).catch(async (err) => {
        // If update fails because document doesn't exist, we create it using setDoc (requires importing setDoc)
        const { setDoc } = await import('firebase/firestore');
        await setDoc(linkRef, { lineGroupLink: lineLink }, { merge: true });
      });

      alert("Club information saved successfully!");
      router.push('/dashboard');
    } catch (error) {
      console.error("Error saving club data:", error);
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || authLoading) {
    return <div className="text-center py-20 text-slate-500">Loading editor...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Edit: {clubName}</h1>
        <button 
          onClick={() => router.push('/dashboard')}
          className="text-slate-500 hover:text-slate-800 font-medium"
        >
          &larr; Back to Dashboard
        </button>
      </div>

      <form onSubmit={handleSave} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-6">
        
        {/* English Description */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Description (English)
          </label>
          <textarea 
            rows={4}
            value={descriptionEn}
            onChange={(e) => setDescriptionEn(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Explain what your club does..."
            required
          />
        </div>

        {/* Japanese Description */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Description (Japanese)
          </label>
          <textarea 
            rows={4}
            value={descriptionJa}
            onChange={(e) => setDescriptionJa(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="クラブの活動内容を説明してください..."
            required
          />
          {/* Note: This is where we will hook up the "Compute on Write" AI translation later */}
          <p className="text-xs text-slate-500 mt-2">
            *In the future, leaving this blank will auto-translate from the English description using AI.
          </p>
        </div>

        <hr className="border-slate-200" />

        {/* Private LINE Group Link */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Official LINE Group Link (Private)
          </label>
          <input 
            type="url"
            value={lineLink}
            onChange={(e) => setLineLink(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="https://line.me/R/ti/g/..."
          />
          <p className="text-xs text-slate-500 mt-2">
            This link is hidden from the public. Only students who apply and are <strong>approved</strong> will see it.
          </p>
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

      </form>
    </div>
  );
}