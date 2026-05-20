"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/config'; // Adjust the path if necessary
import { useAuth } from '@/app/hooks/useAuth';

// Interface for the Application data combined with basic Student info
interface Application {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: Date | any;
}

export default function ManageApplications() {
  const { user, userRole, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const clubId = params.clubId as string;

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [clubName, setClubName] = useState('');

  useEffect(() => {
    if (authLoading) return;

    // Block access if not logged in or not a leader
    if (!user || userRole !== 'leader') {
      router.push('/');
      return;
    }

    const fetchApplications = async () => {
      try {
        // 1. Verify if the current user is actually a leader of this club
        const clubRef = doc(db, 'clubs', clubId);
        const clubSnap = await getDoc(clubRef);

        if (!clubSnap.exists() || !clubSnap.data().leaderIds?.includes(user.uid)) {
          alert("You are not authorized to view applications for this club.");
          router.push('/dashboard');
          return;
        }

        setClubName(clubSnap.data().name_en);

        // 2. Fetch applications for this specific club
        const appsRef = collection(db, 'applications');
        const q = query(appsRef, where('clubId', '==', clubId));
        const querySnapshot = await getDocs(q);

        // 3. Fetch student details for each application (Name and Email)
        // Note: In a real large-scale app, you might denormalize this data to save reads
        const appsData: Application[] = [];
        
        for (const applicationDoc of querySnapshot.docs) {
          const appData = applicationDoc.data();
          
          // Get the student's profile from the 'users' collection
          const studentRef = doc(db, 'users', appData.studentId);
          const studentSnap = await getDoc(studentRef);
          const studentData = studentSnap.exists() ? studentSnap.data() : { displayName: 'Unknown', email: 'Unknown' };

          appsData.push({
            id: applicationDoc.id,
            studentId: appData.studentId,
            studentName: studentData.displayName,
            studentEmail: studentData.email,
            message: appData.message || 'No message provided.',
            status: appData.status,
            appliedAt: appData.appliedAt?.toDate() || new Date(),
          });
        }

        // Sort applications: pending first, then by date (newest first)
        appsData.sort((a, b) => {
          if (a.status === 'pending' && b.status !== 'pending') return -1;
          if (a.status !== 'pending' && b.status === 'pending') return 1;
          return b.appliedAt.getTime() - a.appliedAt.getTime();
        });

        setApplications(appsData);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user, userRole, authLoading, clubId, router]);

  // Handle approving or rejecting an application
  const handleUpdateStatus = async (appId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const appRef = doc(db, 'applications', appId);
      await updateDoc(appRef, {
        status: newStatus
      });

      // Update the local state to reflect the change immediately without refreshing
      setApplications(prev => 
        prev.map(app => app.id === appId ? { ...app, status: newStatus } : app)
      );

    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  if (loading || authLoading) {
    return <div className="text-center py-20 text-slate-500">Loading applications...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Manage Applications</h1>
          <p className="text-slate-600 mt-1">Review join requests for {clubName}</p>
        </div>
        <button 
          onClick={() => router.push('/dashboard')}
          className="text-slate-500 hover:text-slate-800 font-medium"
        >
          &larr; Back to Dashboard
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {applications.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No applications found for this club yet.
          </div>
        ) : (
          <ul className="divide-y divide-slate-200">
            {applications.map((app) => (
              <li key={app.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50 transition-colors">
                
                {/* Student Info */}
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-lg text-slate-900">{app.studentName}</h3>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider
                      ${app.status === 'pending' ? 'bg-amber-100 text-amber-800' : 
                        app.status === 'approved' ? 'bg-green-100 text-green-800' : 
                        'bg-red-100 text-red-800'}`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mb-2">{app.studentEmail}</p>
                  
                  {/* Message from student */}
                  <div className="bg-slate-100 p-3 rounded-lg border border-slate-200 text-sm text-slate-700 italic">
                    "{app.message}"
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Applied on: {app.appliedAt.toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 gap-3">
                  {app.status !== 'approved' && (
                    <button 
                      onClick={() => handleUpdateStatus(app.id, 'approved')}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Approve
                    </button>
                  )}
                  {app.status !== 'rejected' && (
                    <button 
                      onClick={() => handleUpdateStatus(app.id, 'rejected')}
                      className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Reject
                    </button>
                  )}
                </div>

              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}