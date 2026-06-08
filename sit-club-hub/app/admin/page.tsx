"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, doc, updateDoc, arrayUnion, addDoc, serverTimestamp, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/config';
import { useAuth } from '@/app/hooks/useAuth';
import { useTranslation } from '@/app/contexts/useTranslation';
import { Club, Category } from '@/app/types';
import { getAdminUids } from '@/app/utils/constants';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { t, lang } = useTranslation();

  const [clubs, setClubs] = useState<Club[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedClubId, setSelectedClubId] = useState('');
  const [studentUid, setStudentUid] = useState('');
  const [isPromoting, setIsPromoting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [adminUids, setAdminUids] = useState<string[]>([]);

  // Category management states
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [catFormId, setCatFormId] = useState('');
  const [catFormNameEn, setCatFormNameEn] = useState('');
  const [catFormNameJa, setCatFormNameJa] = useState('');
  const [isSavingCategory, setIsSavingCategory] = useState(false);
  const [isDeletingCategory, setIsDeletingCategory] = useState<string | null>(null);
  const [catIdError, setCatIdError] = useState('');

  const handleCatIdChange = (val: string) => {
    setCatFormId(val);
    if (!val) {
      setCatIdError('');
      return;
    }
    const isValid = /^[a-z_]+$/.test(val);
    if (!isValid) {
      setCatIdError('Category ID must strictly contain only lowercase letters and underscores (_).');
    } else {
      setCatIdError('');
    }
  };

  useEffect(() => {
    if (authLoading) return;

    const init = async () => {
      const uids = await getAdminUids();
      setAdminUids(uids);

      if (!user || !uids.includes(user.uid)) {
        router.push('/');
        return;
      }

      try {
        const querySnapshot = await getDocs(collection(db, 'clubs'));
        const allClubs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Club[];
        
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const categoriesData = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Category[];

        setClubs(allClubs);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching all clubs:", error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [user, authLoading, router]);

  const getLocalizedCategory = (clubCat: string) => {
    const matched = categories.find(
      c => c.id === clubCat
    );
    if (matched) {
      return lang === 'ja' && matched.name_ja ? matched.name_ja : matched.name_en;
    }
    return clubCat;
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catFormId.trim() || !catFormNameEn.trim() || !catFormNameJa.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    if (!editingCategoryId && !/^[a-z_]+$/.test(catFormId.trim())) {
      alert("Category ID must contain only lowercase letters and underscores (_).");
      return;
    }
    
    setIsSavingCategory(true);
    try {
      const categoryRef = doc(db, 'categories', catFormId.trim());
      await setDoc(categoryRef, {
        name_en: catFormNameEn.trim(),
        name_ja: catFormNameJa.trim()
      }, { merge: true });

      // Refresh categories snapshot
      const categoriesSnapshot = await getDocs(collection(db, 'categories'));
      const categoriesData = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
      setCategories(categoriesData);

      // Reset form
      setEditingCategoryId(null);
      setCatFormId('');
      setCatFormNameEn('');
      setCatFormNameJa('');
      setCatIdError('');
      alert("Category saved successfully!");
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Failed to save category.");
    } finally {
      setIsSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm(`Are you sure you want to delete the category "${id}"?`)) return;
    
    setIsDeletingCategory(id);
    try {
      await deleteDoc(doc(db, 'categories', id));
      setCategories(prev => prev.filter(c => c.id !== id));
      alert("Category deleted successfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category.");
    } finally {
      setIsDeletingCategory(null);
    }
  };

  const handleCreateNewClub = async () => {
    if (!confirm("Create a new draft club? You will be redirected to edit its details.")) return;
    
    setIsCreating(true);
    try {
      const newClubDraft = {
        name_en: "New Club Draft",
        name_ja: "新しいクラブ",
        category: "General",
        tags: [],
        leaderIds: [], 
        status: "active",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'clubs'), newClubDraft);
      router.push(`/dashboard/edit/${docRef.id}`);
    } catch (error) {
      console.error("Error creating draft club:", error);
      alert("Failed to create new club.");
      setIsCreating(false);
    }
  };

  const handlePromoteLeader = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClubId || !studentUid.trim()) {
      alert("Please select a club and provide a valid Student UID.");
      return;
    }

    setIsPromoting(true);
    try {
      const clubRef = doc(db, 'clubs', selectedClubId);
      await updateDoc(clubRef, {
        leaderIds: arrayUnion(studentUid.trim())
      });

      const userRef = doc(db, 'users', studentUid.trim());
      await updateDoc(userRef, {
        role: 'leader'
      });

      alert(`Success! User ${studentUid} is now a leader of the selected club.`);
      setStudentUid(''); 
    } catch (error) {
      console.error("Error promoting leader:", error);
      alert("Failed to promote user. Check console for details.");
    } finally {
      setIsPromoting(false);
    }
  };

  if (authLoading || loading) {
    return <div className="text-center py-20 text-slate-500 font-medium">{t('admin.verifying')}</div>;
  }

  if (!user || !adminUids.includes(user.uid)) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      <section className="bg-slate-900 p-8 rounded-xl shadow-lg border border-slate-800 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <span className="text-amber-400">👑</span> {t('admin.title')}
            </h1>
            <p className="text-slate-400">{t('admin.subtitle')}</p>
          </div>
          <button 
            onClick={handleCreateNewClub}
            disabled={isCreating}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-800 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-sm"
          >
            {isCreating ? t('admin.creating') : t('admin.createClub')}
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="font-bold text-xl text-dark border-b border-slate-100 pb-2 mb-4">
            {t('admin.assignLeader')}
          </h2>
          <form onSubmit={handlePromoteLeader} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">{t('admin.targetClub')}</label>
              <select 
                value={selectedClubId}
                onChange={(e) => setSelectedClubId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                required
              >
                <option value="" disabled>{t('admin.selectClub')}</option>
                {clubs.map(c => (
                  <option key={c.id} value={c.id}>{lang === 'ja' && c.name_ja ? c.name_ja : c.name_en} ({getLocalizedCategory(c.category)})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">{t('admin.studentUid')}</label>
              <input 
                type="text" 
                value={studentUid}
                onChange={(e) => setStudentUid(e.target.value)}
                placeholder={t('admin.uidPlaceholder')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                required
              />
              <p className="text-xs text-slate-500 mt-1">{t('admin.uidHint')}</p>
            </div>
            <button 
              type="submit"
              disabled={isPromoting}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 px-4 rounded-lg mt-2 disabled:bg-slate-400 transition-colors"
            >
              {isPromoting ? t('admin.promoting') : t('admin.promote')}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h2 className="font-bold text-xl text-dark">{t('admin.globalDirectory')}</h2>
            <span className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
              {clubs.length} {t('admin.total')}
            </span>
          </div>
          
          <ul className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {clubs.map((club) => (
              <li key={club.id} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-900">{lang === 'ja' && club.name_ja ? club.name_ja : club.name_en}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      {getLocalizedCategory(club.category)}
                    </span>
                    <span className="text-xs text-slate-500">
                      ID: <span className="font-mono bg-slate-100 px-1 rounded">{club.id}</span>
                    </span>
                  </div>
                </div>
                
                {/* Updated Action Buttons Container */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => router.push(`/dashboard/events/${club.id}`)}
                    className="text-sm font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-lg transition-colors"
                  >
                    {t('admin.events')}
                  </button>
                  <button 
                    onClick={() => router.push(`/dashboard/edit/${club.id}`)}
                    className="text-sm font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 px-4 py-2 rounded-lg transition-colors"
                  >
                    {t('admin.edit')}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Category Management Widget */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="font-bold text-xl text-slate-800 border-b border-slate-100 pb-4 mb-6 flex items-center gap-2">
          <span>📁</span> Category Management
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Form Side */}
          <div className="md:col-span-1 bg-slate-50 p-5 rounded-lg border border-slate-200 space-y-4">
            <h3 className="font-bold text-lg text-slate-800">
              {editingCategoryId ? 'Edit Category' : 'Create Category'}
            </h3>
            
            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Category ID (document ID)</label>
                <input 
                  type="text"
                  value={catFormId}
                  onChange={(e) => handleCatIdChange(e.target.value)}
                  placeholder="e.g. engineering"
                  className={`w-full px-3 py-2 border rounded-lg text-sm disabled:bg-slate-100 disabled:text-slate-500 focus:outline-none focus:ring-2 ${
                    catIdError 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-slate-300 focus:ring-slate-500 focus:border-slate-500'
                  }`}
                  disabled={!!editingCategoryId}
                  required
                />
                {catIdError ? (
                  <p className="text-xs text-red-600 mt-1 font-medium">{catIdError}</p>
                ) : (
                  !editingCategoryId && (
                    <p className="text-xs text-slate-500 mt-1">This will be the unique identifier for the category.</p>
                  )
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">English Name</label>
                <input 
                  type="text"
                  value={catFormNameEn}
                  onChange={(e) => setCatFormNameEn(e.target.value)}
                  placeholder="e.g. Engineering"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Japanese Name</label>
                <input 
                  type="text"
                  value={catFormNameJa}
                  onChange={(e) => setCatFormNameJa(e.target.value)}
                  placeholder="e.g. 工学"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSavingCategory}
                  className="flex-grow bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 px-4 rounded-lg text-sm disabled:bg-slate-400 transition-colors shadow-sm cursor-pointer"
                >
                  {isSavingCategory ? 'Saving...' : (editingCategoryId ? 'Save Changes' : 'Create')}
                </button>
                {editingCategoryId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCategoryId(null);
                      setCatFormId('');
                      setCatFormNameEn('');
                      setCatFormNameJa('');
                      setCatIdError('');
                    }}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2 px-4 rounded-lg text-sm transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List Side */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-bold text-lg text-slate-800">
              Active Categories ({categories.length})
            </h3>
            
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">English</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Japanese</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-mono font-medium text-slate-900">{cat.id}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{cat.name_en}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{cat.name_ja}</td>
                      <td className="px-4 py-3 text-sm text-right space-x-3">
                        <button
                          onClick={() => {
                            setEditingCategoryId(cat.id);
                            setCatFormId(cat.id);
                            setCatFormNameEn(cat.name_en);
                            setCatFormNameJa(cat.name_ja);
                            setCatIdError('');
                          }}
                          className="text-blue-600 hover:text-blue-900 font-semibold cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          disabled={isDeletingCategory === cat.id}
                          className="text-red-600 hover:text-red-900 font-semibold disabled:text-red-300 cursor-pointer"
                        >
                          {isDeletingCategory === cat.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {categories.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-slate-400 text-sm">
                        No categories found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}