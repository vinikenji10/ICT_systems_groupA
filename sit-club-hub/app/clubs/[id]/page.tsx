"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '@/app/firebase/config';
import { useAuth } from '@/app/hooks/useAuth';

// Interface for the Club data updated with new structured fields
interface Club {
  id: string;
  name_en: string;
  name_ja: string;
  category: string;
  description_en: string;
  description_ja: string;
  tags: string[];
  logoUrl?: string;
  activity?: string;
  level?: string;
  schedule?: string;
  scheduleInfo?: string;
  location?: string;
  mainPlaces?: string;
  equipment?: string;
  membershipFee?: string;
  payment?: string;
}

export default function ClubDetails() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const clubId = params.id as string;

  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Application states
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  // Fetch Club Details
  useEffect(() => {
    const fetchClub = async () => {
      try {
        const clubRef = doc(db, 'clubs', clubId);
        const clubSnap = await getDoc(clubRef);

        if (clubSnap.exists()) {
          setClub({ id: clubSnap.id, ...clubSnap.data() } as Club);
        } else {
          alert("Club not found.");
          router.push('/');
        }
      } catch (error) {
        console.error("Error fetching club details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClub();
  }, [clubId, router]);

  // Check if the current user has already applied
  useEffect(() => {
    if (!user || authLoading) return;

    const checkApplicationStatus = async () => {
      try {
        const appsRef = collection(db, 'applications');
        const q = query(
          appsRef, 
          where('clubId', '==', clubId),
          where('studentId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setHasApplied(true);
          setApplicationStatus(querySnapshot.docs[0].data().status);
        }
      } catch (error) {
        console.error("Error checking application status:", error);
      }
    };

    checkApplicationStatus();
  }, [user, authLoading, clubId]);

  // Handle the "One-Click Application"
  const handleApply = async () => {
    if (!user) {
      alert("Please sign in to apply to this club.");
      return;
    }

    setIsApplying(true);

    try {
      const appsRef = collection(db, 'applications');
      await addDoc(appsRef, {
        clubId: clubId,
        studentId: user.uid,
        status: 'pending',
        message: 'I am interested in joining this club!',
        appliedAt: serverTimestamp()
      });

      setHasApplied(true);
      setApplicationStatus('pending');
      alert("Application sent successfully!");
    } catch (error) {
      console.error("Error sending application:", error);
      alert("Failed to send application. Please try again.");
    } finally {
      setIsApplying(false);
    }
  };

  if (loading || authLoading) {
    return <div className="text-center py-20 text-slate-500">Loading club details...</div>;
  }

  if (!club) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Image Section */}
        <div className="h-64 w-full bg-slate-200 relative overflow-hidden flex items-center justify-center">
          {club.logoUrl ? (
            <img
              src={club.logoUrl}
              alt={`Banner of ${club.name_en}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-slate-400 font-medium">Banner Image Placeholder</span>
          )}
        </div>
        
        <div className="p-8">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded-md mb-3 inline-block">
                {club.category}
              </span>
              <h1 className="text-3xl font-bold text-slate-900 mb-1">{club.name_en}</h1>
              <h2 className="text-lg text-slate-500 font-medium">{club.name_ja}</h2>
            </div>

            {/* Application Button Area */}
            <div className="text-right">
              {!hasApplied ? (
                <button 
                  onClick={handleApply}
                  disabled={isApplying}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-sm"
                >
                  {isApplying ? 'Sending...' : 'Join Club (Apply)'}
                </button>
              ) : (
                <div className="inline-block border border-slate-200 bg-slate-50 px-6 py-3 rounded-lg text-left">
                  <p className="text-sm text-slate-500 mb-1">Application Status</p>
                  <p className={`font-bold capitalize
                    ${applicationStatus === 'pending' ? 'text-amber-600' : 
                      applicationStatus === 'approved' ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {applicationStatus}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-6">
            {club.tags?.map((tag, idx) => (
              <span key={idx} className="text-sm font-medium bg-slate-100 text-slate-600 px-3 py-1 rounded-md border border-slate-200">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-xl text-slate-800 mb-4">About Us</h3>
          <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
            {club.description_en || "No description provided."}
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-xl text-slate-800 mb-4">クラブについて</h3>
          <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
            {club.description_ja || "詳細はありません。"}
          </p>
        </div>
      </div>

      {/* Structured Information Section */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h3 className="font-bold text-xl text-slate-800 mb-6">Detailed Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 text-sm">
          
          <div className="flex flex-col md:flex-row py-3 border-b border-slate-100 gap-2 md:gap-4">
            <span className="font-bold text-slate-800 md:w-32 shrink-0">Activity</span>
            <span className="text-slate-600">{club.activity || '-'}</span>
          </div>
          
          <div className="flex flex-col md:flex-row py-3 border-b border-slate-100 gap-2 md:gap-4">
            <span className="font-bold text-slate-800 md:w-32 shrink-0">Level</span>
            <span className="text-slate-600">{club.level || '-'}</span>
          </div>

          <div className="flex flex-col md:flex-row py-3 border-b border-slate-100 gap-2 md:gap-4">
            <span className="font-bold text-slate-800 md:w-32 shrink-0">Schedule</span>
            <span className="text-slate-600">{club.schedule || '-'}</span>
          </div>

          <div className="flex flex-col md:flex-row py-3 border-b border-slate-100 gap-2 md:gap-4">
            <span className="font-bold text-slate-800 md:w-32 shrink-0">Schedule Info</span>
            <span className="text-slate-600">{club.scheduleInfo || '-'}</span>
          </div>

          <div className="flex flex-col md:flex-row py-3 border-b border-slate-100 gap-2 md:gap-4">
            <span className="font-bold text-slate-800 md:w-32 shrink-0">Location</span>
            <span className="text-slate-600">{club.location || '-'}</span>
          </div>

          <div className="flex flex-col md:flex-row py-3 border-b border-slate-100 gap-2 md:gap-4">
            <span className="font-bold text-slate-800 md:w-32 shrink-0">Main Places</span>
            <span className="text-slate-600">{club.mainPlaces || '-'}</span>
          </div>

          <div className="flex flex-col md:flex-row py-3 border-b border-slate-100 gap-2 md:gap-4">
            <span className="font-bold text-slate-800 md:w-32 shrink-0">Equipment</span>
            <span className="text-slate-600">{club.equipment || '-'}</span>
          </div>

          <div className="flex flex-col md:flex-row py-3 border-b border-slate-100 gap-2 md:gap-4">
            <span className="font-bold text-slate-800 md:w-32 shrink-0">Membership Fee</span>
            <span className="text-slate-600">{club.membershipFee || '-'}</span>
          </div>

          <div className="flex flex-col md:flex-row py-3 md:col-span-2 border-b border-slate-100 gap-2 md:gap-4">
            <span className="font-bold text-slate-800 md:w-32 shrink-0">Payment Info</span>
            <span className="text-slate-600">{club.payment || '-'}</span>
          </div>

        </div>
      </div>

    </div>
  );
}