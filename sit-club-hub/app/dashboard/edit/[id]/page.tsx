"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc, updateDoc, collection, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/app/firebase/config';
import { useAuth } from '@/app/hooks/useAuth';
import { useTranslation } from '@/app/contexts/useTranslation';
import type { TranslationKey } from '@/app/contexts/translations';
import { getAdminUids } from '@/app/utils/constants';

export default function EditClub() {
  const { user, userRole, loading: authLoading } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const params = useParams();
  const clubId = params.id as string;

  // Club Name states
  const [nameEn, setNameEn] = useState('');
  const [nameJa, setNameJa] = useState('');

  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionJa, setDescriptionJa] = useState('');
  const [lineLink, setLineLink] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  
  // Structured Information states (Bilingual)
  const [activityEn, setActivityEn] = useState('');
  const [activityJa, setActivityJa] = useState('');
  const [levelEn, setLevelEn] = useState('');
  const [levelJa, setLevelJa] = useState('');
  const [scheduleEn, setScheduleEn] = useState('');
  const [scheduleJa, setScheduleJa] = useState('');
  const [scheduleInfoEn, setScheduleInfoEn] = useState('');
  const [scheduleInfoJa, setScheduleInfoJa] = useState('');
  const [locationEn, setLocationEn] = useState('');
  const [locationJa, setLocationJa] = useState('');
  const [mainPlacesEn, setMainPlacesEn] = useState('');
  const [mainPlacesJa, setMainPlacesJa] = useState('');
  const [equipmentEn, setEquipmentEn] = useState('');
  const [equipmentJa, setEquipmentJa] = useState('');
  const [membershipFeeEn, setMembershipFeeEn] = useState('');
  const [membershipFeeJa, setMembershipFeeJa] = useState('');
  const [paymentEn, setPaymentEn] = useState('');
  const [paymentJa, setPaymentJa] = useState('');

  const [logoUrl, setLogoUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [headerName, setHeaderName] = useState(''); // Keep original name for header
  const [adminUids, setAdminUids] = useState<string[]>([]);

  useEffect(() => {
    if (authLoading) return;

    const init = async () => {
      const uids = await getAdminUids();
      setAdminUids(uids);

      // Allow access if user is leader OR an admin
      if (!user || (userRole !== 'leader' && !uids.includes(user.uid))) {
        router.push('/');
        return;
      }

      try {
        const clubRef = doc(db, 'clubs', clubId);
        const clubSnap = await getDoc(clubRef);

        if (clubSnap.exists()) {
          const data = clubSnap.data();
          
          // Block ONLY if user is not a leader AND not an admin
          if (!data.leaderIds?.includes(user.uid) && !uids.includes(user.uid)) {
            alert("You are not authorized to edit this club.");
            router.push('/dashboard');
            return;
          }

          setHeaderName(data.name_en || 'Club');
          setNameEn(data.name_en || '');
          setNameJa(data.name_ja || '');
          setDescriptionEn(data.description_en || '');
          setDescriptionJa(data.description_ja || '');
          setLogoUrl(data.logoUrl || '');
          setInstagramUrl(data.instagramUrl || '');
          
          setActivityEn(data.activity_en || '');
          setActivityJa(data.activity_ja || '');
          setLevelEn(data.level_en || '');
          setLevelJa(data.level_ja || '');
          setScheduleEn(data.schedule_en || '');
          setScheduleJa(data.schedule_ja || '');
          setScheduleInfoEn(data.scheduleInfo_en || '');
          setScheduleInfoJa(data.scheduleInfo_ja || '');
          setLocationEn(data.location_en || '');
          setLocationJa(data.location_ja || '');
          setMainPlacesEn(data.mainPlaces_en || '');
          setMainPlacesJa(data.mainPlaces_ja || '');
          setEquipmentEn(data.equipment_en || '');
          setEquipmentJa(data.equipment_ja || '');
          setMembershipFeeEn(data.membershipFee_en || '');
          setMembershipFeeJa(data.membershipFee_ja || '');
          setPaymentEn(data.payment_en || '');
          setPaymentJa(data.payment_ja || '');

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

    init();
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

      // Handle image upload if a new one was selected
      if (imageFile) {
        const fileExtension = imageFile.name.split('.').pop();
        const storageRef = ref(storage, `clubs/${clubId}/logo_${Date.now()}.${fileExtension}`);
        
        const snapshot = await uploadBytes(storageRef, imageFile);
        finalLogoUrl = await getDownloadURL(snapshot.ref);
      }

      const clubRef = doc(db, 'clubs', clubId);
      await updateDoc(clubRef, {
        name_en: nameEn,     // Save updated English Name
        name_ja: nameJa,     // Save updated Japanese Name
        description_en: descriptionEn,
        description_ja: descriptionJa,
        logoUrl: finalLogoUrl,
        instagramUrl: instagramUrl,
        activity_en: activityEn,
        activity_ja: activityJa,
        level_en: levelEn,
        level_ja: levelJa,
        schedule_en: scheduleEn,
        schedule_ja: scheduleJa,
        scheduleInfo_en: scheduleInfoEn,
        scheduleInfo_ja: scheduleInfoJa,
        location_en: locationEn,
        location_ja: locationJa,
        mainPlaces_en: mainPlacesEn,
        mainPlaces_ja: mainPlacesJa,
        equipment_en: equipmentEn,
        equipment_ja: equipmentJa,
        membershipFee_en: membershipFeeEn,
        membershipFee_ja: membershipFeeJa,
        payment_en: paymentEn,
        payment_ja: paymentJa,
        updatedAt: new Date()
      });

      const linkRef = doc(db, 'clubs', clubId, 'privateData', 'links');
      await updateDoc(linkRef, {
        lineGroupLink: lineLink
      }).catch(async () => {
        const { setDoc } = await import('firebase/firestore');
        await setDoc(linkRef, { lineGroupLink: lineLink }, { merge: true });
      });

      alert("Club information saved successfully!");
      // Redirect Admins back to Admin panel, Leaders to Dashboard
      if (adminUids.includes(user?.uid || '')) {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error("Error saving club data:", error);
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClub = async () => {
    if (!adminUids.includes(user?.uid || '')) {
      alert("You are not authorized to delete this club.");
      return;
    }
    if (!confirm("Are you sure you want to delete this club? This action cannot be undone.")) return;
    if (!confirm("Final warning: All events, applications, and data for this club will be permanently deleted.")) return;

    setDeleting(true);
    try {
      const batch = writeBatch(db);

      const clubRef = doc(db, 'clubs', clubId);
      batch.delete(clubRef);

      const eventsSnap = await getDocs(query(collection(db, 'events'), where('clubId', '==', clubId)));
      eventsSnap.forEach(d => batch.delete(d.ref));

      const appsSnap = await getDocs(query(collection(db, 'applications'), where('clubId', '==', clubId)));
      appsSnap.forEach(d => batch.delete(d.ref));

      await batch.commit();

      alert("Club deleted successfully.");
      router.push('/admin');
    } catch (error) {
      console.error("Error deleting club:", error);
      alert("Failed to delete club. Check console for details.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading || authLoading) {
    return <div className="text-center py-20 text-slate-500">{t('edit.loading')}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">{t('edit.title', { name: headerName })}</h1>
        <button 
          onClick={() => adminUids.includes(user?.uid || '') ? router.push('/admin') : router.push('/dashboard')}
          className="text-slate-500 hover:text-dark font-medium"
        >
          &larr; {t('edit.back')}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        <div className="bg-white p-8 rounded-xl shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-dark border-b border-slate-100 pb-2">{t('edit.basicInfo')}</h2>
          
          {/* Club Name Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">{t('edit.nameEn')}</label>
              <input type="text" required value={nameEn} onChange={(e) => setNameEn(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">{t('edit.nameJa')}</label>
              <input type="text" required value={nameJa} onChange={(e) => setNameJa(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
          </div>

          <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="shrink-0">
              <div className="h-24 w-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-slate-200 flex items-center justify-center">
                {(imagePreview || logoUrl) ? (
                  <img src={imagePreview || logoUrl} alt="Club Logo" className="h-full w-full object-cover"/>
                ) : (
                  <span className="text-slate-400 text-xs">{t('edit.noLogo')}</span>
                )}
              </div>
            </div>
            <div className="flex-grow">
              <label className="block text-sm font-semibold text-slate-700 mb-2">{t('edit.logoLabel')}</label>
              <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">{t('edit.descriptionEn')}</label>
              <textarea rows={4} value={descriptionEn} onChange={(e) => setDescriptionEn(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">{t('edit.descriptionJa')}</label>
              <textarea rows={4} value={descriptionJa} onChange={(e) => setDescriptionJa(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-dark border-b border-slate-100 pb-2">{t('edit.detailedInfo')}</h2>
          
          {/* Helper function to render bilingual rows cleanly */}
          {[
            { key: 'edit.activity' as TranslationKey, stateEn: activityEn, setEn: setActivityEn, stateJa: activityJa, setJa: setActivityJa },
            { key: 'edit.level' as TranslationKey, stateEn: levelEn, setEn: setLevelEn, stateJa: levelJa, setJa: setLevelJa },
            { key: 'edit.schedule' as TranslationKey, stateEn: scheduleEn, setEn: setScheduleEn, stateJa: scheduleJa, setJa: setScheduleJa },
            { key: 'edit.scheduleInfo' as TranslationKey, stateEn: scheduleInfoEn, setEn: setScheduleInfoEn, stateJa: scheduleInfoJa, setJa: setScheduleInfoJa },
            { key: 'edit.location' as TranslationKey, stateEn: locationEn, setEn: setLocationEn, stateJa: locationJa, setJa: setLocationJa },
            { key: 'edit.mainPlaces' as TranslationKey, stateEn: mainPlacesEn, setEn: setMainPlacesEn, stateJa: mainPlacesJa, setJa: setMainPlacesJa },
            { key: 'edit.equipment' as TranslationKey, stateEn: equipmentEn, setEn: setEquipmentEn, stateJa: equipmentJa, setJa: setEquipmentJa },
            { key: 'edit.membershipFee' as TranslationKey, stateEn: membershipFeeEn, setEn: setMembershipFeeEn, stateJa: membershipFeeJa, setJa: setMembershipFeeJa },
            { key: 'edit.payment' as TranslationKey, stateEn: paymentEn, setEn: setPaymentEn, stateJa: paymentJa, setJa: setPaymentJa },
          ].map((field, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-slate-50 last:border-0">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t(field.key)} (EN)</label>
                <input type="text" value={field.stateEn} onChange={(e) => field.setEn(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t(field.key)} (JA)</label>
                <input type="text" value={field.stateJa} onChange={(e) => field.setJa(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold text-dark border-b border-slate-100 pb-2 mb-6">{t('edit.instagramLink')}</h2>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Instagram URL</label>
            <input type="url" value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="https://instagram.com/username" />
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold text-dark border-b border-slate-100 pb-2 mb-6">{t('edit.privateSettings')}</h2>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">{t('edit.lineLink')}</label>
            <input type="url" value={lineLink} onChange={(e) => setLineLink(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="https://line.me/R/ti/g/..." />
          </div>
        </div>

        <div className="pt-2 pb-10">
          <button type="submit" disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-4 px-4 rounded-xl transition-colors flex justify-center items-center text-lg shadow-sm">
            {saving ? t('edit.saving') : t('edit.save')}
          </button>
        </div>

        {adminUids.includes(user?.uid || '') && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 space-y-4">
            <h2 className="text-xl font-bold text-red-800">Danger Zone</h2>
            <p className="text-sm text-red-700">Permanently delete this club and all associated events, applications, and data. This cannot be undone.</p>
            <button
              type="button"
              onClick={handleDeleteClub}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-sm"
            >
              {deleting ? 'Deleting...' : 'Delete Club'}
            </button>
          </div>
        )}

      </form>
    </div>
  );
}