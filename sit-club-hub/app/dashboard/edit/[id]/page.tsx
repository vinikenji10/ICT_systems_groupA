"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/app/firebase/config';
import { useAuth } from '@/app/hooks/useAuth';

export default function EditClub() {
  const { user, userRole, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const clubId = params.id as string;

  // Existing Form states
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionJa, setDescriptionJa] = useState('');
  const [lineLink, setLineLink] = useState('');
  
  // New Structured Information states
  const [activity, setActivity] = useState('');
  const [level, setLevel] = useState('');
  const [schedule, setSchedule] = useState('');
  const [scheduleInfo, setScheduleInfo] = useState('');
  const [location, setLocation] = useState('');
  const [mainPlaces, setMainPlaces] = useState('');
  const [equipment, setEquipment] = useState('');
  const [membershipFee, setMembershipFee] = useState('');
  const [payment, setPayment] = useState('');

  // Image states
  const [logoUrl, setLogoUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // UI states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [clubName, setClubName] = useState('');

  useEffect(() => {
    if (authLoading) return;

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
          
          if (!data.leaderIds?.includes(user.uid)) {
            alert("You are not authorized to edit this club.");
            router.push('/dashboard');
            return;
          }

          setClubName(data.name_en);
          setDescriptionEn(data.description_en || '');
          setDescriptionJa(data.description_ja || '');
          setLogoUrl(data.logoUrl || '');
          
          // Populate new structured fields
          setActivity(data.activity || '');
          setLevel(data.level || '');
          setSchedule(data.schedule || '');
          setScheduleInfo(data.scheduleInfo || '');
          setLocation(data.location || '');
          setMainPlaces(data.mainPlaces || '');
          setEquipment(data.equipment || '');
          setMembershipFee(data.membershipFee || '');
          setPayment(data.payment || '');

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let finalLogoUrl = logoUrl;

      if (imageFile) {
        const fileExtension = imageFile.name.split('.').pop();
        const storageRef = ref(storage, `clubs/${clubId}/logo_${Date.now()}.${fileExtension}`);
        
        const snapshot = await uploadBytes(storageRef, imageFile);
        finalLogoUrl = await getDownloadURL(snapshot.ref);
      }

      // Update public club data (including new structured fields)
      const clubRef = doc(db, 'clubs', clubId);
      await updateDoc(clubRef, {
        description_en: descriptionEn,
        description_ja: descriptionJa,
        logoUrl: finalLogoUrl,
        activity,
        level,
        schedule,
        scheduleInfo,
        location,
        mainPlaces,
        equipment,
        membershipFee,
        payment,
        updatedAt: new Date()
      });

      // Update private LINE link
      const linkRef = doc(db, 'clubs', clubId, 'privateData', 'links');
      await updateDoc(linkRef, {
        lineGroupLink: lineLink
      }).catch(async (err) => {
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
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Edit: {clubName}</h1>
        <button 
          onClick={() => router.push('/dashboard')}
          className="text-slate-500 hover:text-slate-800 font-medium"
        >
          &larr; Back to Dashboard
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Basic Info Section */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-6">
          <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2">Basic Info & Image</h2>
          
          <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="shrink-0">
              <div className="h-24 w-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-slate-200 flex items-center justify-center">
                {(imagePreview || logoUrl) ? (
                  <img 
                    src={imagePreview || logoUrl} 
                    alt="Club Logo" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-slate-400 text-xs">No Logo</span>
                )}
              </div>
            </div>
            <div className="flex-grow">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Club Logo / Banner
              </label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description (English)</label>
            <textarea 
              rows={3}
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="General overview..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description (Japanese)</label>
            <textarea 
              rows={3}
              value={descriptionJa}
              onChange={(e) => setDescriptionJa(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="..."
              required
            />
          </div>
        </div>

        {/* Detailed Information Section */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-6">
          <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2">Detailed Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Activity</label>
              <input 
                type="text" value={activity} onChange={(e) => setActivity(e.target.value)}
                placeholder="e.g. International exchange, friendship..."
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Level</label>
              <input 
                type="text" value={level} onChange={(e) => setLevel(e.target.value)}
                placeholder="e.g. Open to everyone"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Schedule</label>
              <input 
                type="text" value={schedule} onChange={(e) => setSchedule(e.target.value)}
                placeholder="e.g. Varies every month"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Schedule Info</label>
              <input 
                type="text" value={scheduleInfo} onChange={(e) => setScheduleInfo(e.target.value)}
                placeholder="e.g. Posted on Instagram"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Location</label>
              <input 
                type="text" value={location} onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Varies depending on activity"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Main Places</label>
              <input 
                type="text" value={mainPlaces} onChange={(e) => setMainPlaces(e.target.value)}
                placeholder="e.g. Asakusa, Omiya..."
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Equipment</label>
              <input 
                type="text" value={equipment} onChange={(e) => setEquipment(e.target.value)}
                placeholder="e.g. Willingness to interact"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Membership Fee</label>
              <input 
                type="text" value={membershipFee} onChange={(e) => setMembershipFee(e.target.value)}
                placeholder="e.g. None"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Payment</label>
              <input 
                type="text" value={payment} onChange={(e) => setPayment(e.target.value)}
                placeholder="e.g. No fixed payment; collected when needed"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

          </div>
        </div>

        {/* Private Data Section */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2 mb-6">Private Settings</h2>
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
        </div>

        <div className="pt-2 pb-10">
          <button 
            type="submit" 
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-4 px-4 rounded-xl transition-colors flex justify-center items-center gap-2 text-lg shadow-sm"
          >
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>

      </form>
    </div>
  );
}