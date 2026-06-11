"use client";

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/app/firebase/config';
import { useTranslation } from '@/app/contexts/useTranslation';
import { Facility, Category } from '@/app/types';
import SearchWidget from "@/app/components/SearchWidget";
import CategoryFilter from "@/app/components/CategoryFilter";

export default function FacilitiesPage() {
  const { t, lang } = useTranslation();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dbCategories, setDbCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'facilities'));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Facility[];
        
        setFacilities(data);
        setFilteredFacilities(data);

        // Extract building names for category filter
        const buildings = Array.from(new Set(data.map(f => f.building).filter(Boolean)));
        const categories: Category[] = buildings.map(b => ({
          id: b,
          name_en: b,
          name_ja: b
        }));
        setDbCategories(categories);

      } catch (error) {
        console.error("Error fetching facilities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  useEffect(() => {
    let result = facilities;

    if (selectedCategory !== "All") {
      result = result.filter(f => f.building === selectedCategory);
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        f =>
          f.name_en.toLowerCase().includes(query) ||
          f.name_ja?.toLowerCase().includes(query) ||
          f.description_en?.toLowerCase().includes(query) ||
          f.description_ja?.toLowerCase().includes(query) ||
          f.building?.toLowerCase().includes(query) ||
          f.tags?.some(tag => tag.toLowerCase().includes(query)) ||
          f.facilities?.some(fac => fac.toLowerCase().includes(query))
      );
    }

    setFilteredFacilities(result);
  }, [searchQuery, selectedCategory, facilities]);

  if (loading) {
    return <div className="text-center py-20 text-emerald-50 text-lg">{t('facilities.loading')}</div>;
  }

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Full bleed fixed background to break out of layout constraints */}
      <div className="fixed inset-0 bg-[#0d4f37] z-0 pointer-events-none" />
      
      {/* Ambient background blur shapes for modern feel */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/40 blur-[120px]"></div>
        <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-secondary/30 blur-[150px]"></div>
        <div className="absolute bottom-[-20%] left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-400/30 blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full space-y-8 pb-8">
        <section className="bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{t('facilities.title')}</h1>
            <p className="text-slate-600 font-medium text-lg">{t('facilities.subtitle')}</p>
          </div>
          <SearchWidget value={searchQuery} onChange={setSearchQuery} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-1">
            <CategoryFilter
              categories={dbCategories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFacilities.length === 0 ? (
              <div className="col-span-full py-12 text-center backdrop-blur-md bg-white/5 rounded-3xl border border-white/10 shadow-inner">
                <p className="text-emerald-100 font-medium">{t('facilities.noFacilities')}</p>
              </div>
            ) : (
              filteredFacilities.map((facility) => (
                <div key={facility.id} className="bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:bg-white/90">
                  {facility.imageUrl && (
                    <div className="h-44 w-full bg-slate-100 overflow-hidden shrink-0">
                      <img
                        src={facility.imageUrl}
                        alt={lang === 'ja' ? facility.name_ja : facility.name_en}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-bold text-lg text-slate-900 mb-1">
                      {lang === 'ja' && facility.name_ja ? facility.name_ja : facility.name_en}
                    </h3>
                    {lang === 'en' && facility.name_ja && (
                      <p className="text-sm text-slate-400 mb-3">{facility.name_ja}</p>
                    )}

                    <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-grow">
                      {lang === 'ja' && facility.description_ja
                        ? facility.description_ja
                        : facility.description_en}
                    </p>

                    <div className="space-y-2 text-sm text-slate-600 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-700 w-16">{t('facilities.building')}:</span>
                        <span>{facility.building}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-700 w-16">{t('facilities.floor')}:</span>
                        <span>{facility.floor}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-700 w-16">{t('facilities.room')}:</span>
                        <span>{facility.roomNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-700 w-16">{t('facilities.hours')}:</span>
                        <span>{lang === 'ja' ? facility.hours_ja : facility.hours_en}</span>
                      </div>
                    </div>

                    {facility.facilities && facility.facilities.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{t('facilities.amenities')}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {facility.facilities.map((item, idx) => (
                            <span key={idx} className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
