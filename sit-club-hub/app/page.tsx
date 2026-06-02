"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { useTranslation } from "@/app/contexts/useTranslation";
import type { TranslationKey } from "@/app/contexts/translations";
import { Club, Category } from "@/app/types";

export default function DiscoveryPage() {
  const router = useRouter();
  const { t, tt, lang } = useTranslation();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [filteredClubs, setFilteredClubs] = useState<Club[]>([]);
  const [dbCategories, setDbCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clubsSnapshot = await getDocs(collection(db, "clubs"));
        const clubsData = clubsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Club[];

        const categoriesSnapshot = await getDocs(collection(db, "categories"));
        const categoriesData = categoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Category[];

        setClubs(clubsData);
        setFilteredClubs(clubsData);
        setDbCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let result = clubs;

    if (selectedCategory !== "All") {
      result = result.filter((club) => {
        const isCategoryMatch = club.category === selectedCategory;
        const isTagMatch = club.tags?.some(tag => tag === selectedCategory);
        return isCategoryMatch || isTagMatch;
      });
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (club) =>
          club.name_en.toLowerCase().includes(query) ||
          club.name_ja?.toLowerCase().includes(query) ||
          club.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    setFilteredClubs(result);
  }, [searchQuery, selectedCategory, clubs, dbCategories]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d4f37] flex items-center justify-center text-white text-lg">
        {t('discovery.loading')}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d4f37] p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="bg-white rounded-2xl p-8 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-slate-900">{t('discovery.title')}</h1>
            <p className="text-slate-500 font-medium">{t('discovery.subtitle')}</p>
          </div>
          <div className="w-full md:w-96">
            <input
              type="text"
              placeholder={t('discovery.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium bg-slate-50 text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          <div className="bg-white rounded-2xl p-6 shadow-md space-y-4">
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider px-2">{t('discovery.categories')}</h3>
            <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-2 lg:pb-0">
              <button
                key="All"
                onClick={() => setSelectedCategory("All")}
                className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap text-sm ${
                  selectedCategory === "All"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {t('discovery.catAll')}
              </button>
              {dbCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap text-sm ${
                    selectedCategory === category.id
                      ? "bg-background text-foreground shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {lang === 'ja' && category.name_ja ? category.name_ja : category.name_en}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredClubs.length > 0 ? (
              filteredClubs.map((club) => (
                <div
                  key={club.id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col group transition-all hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="h-48 w-full bg-slate-100 relative overflow-hidden shrink-0 border-b border-slate-100">
                    {club.logoUrl ? (
                      <img
                        src={club.logoUrl}
                        alt={`Logo of ${club.name_en}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm font-medium">
                        {t('discovery.imagePlaceholder')}
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-grow space-y-4">
                    <div className="flex flex-wrap gap-1.5">
                      {club.tags?.map((tag, idx) => (
                        <span
                          key={idx}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-md tracking-wide ${
                            idx === 0
                              ? "bg-blue-50 text-blue-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {tt(tag)}
                        </span>
                      ))}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-slate-900 leading-snug">
                          {lang === 'ja' && club.name_ja ? club.name_ja : club.name_en}
                        </h2>
                        {club.instagramUrl && (
                          <a 
                            href={club.instagramUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[#e1306c] hover:text-[#c13584] transition-colors shrink-0"
                            aria-label="Instagram"
                          >
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                            </svg>
                          </a>
                        )}
                      </div>
                      {lang === 'en' && club.name_ja && (
                        <p className="text-xs font-medium text-slate-400 font-sans">{club.name_ja}</p>
                      )}
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 flex-grow">
                      {lang === 'ja' && club.description_ja ? club.description_ja : club.description_en || t('club.noDescription')}
                    </p>

                    <button
                      onClick={() => router.push(`/clubs/${club.id}`)}
                      className="w-full bg-[#121824] hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl transition-colors text-sm mt-auto"
                    >
                      {t('discovery.viewDetails')}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-emerald-100 font-medium">
                {t('discovery.noClubs')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
