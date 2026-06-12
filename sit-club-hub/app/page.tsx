"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { useTranslation } from "@/app/contexts/useTranslation";
import { Club, Category } from "@/app/types";
import ClubInfoCard from "@/app/components/ClubInfoCard";
import SearchWidget from "@/app/components/SearchWidget";
import CategoryFilter from "@/app/components/CategoryFilter";

export default function DiscoveryPage() {
  const { t } = useTranslation();
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
        
        <div className="bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{t('discovery.title')}</h1>
            <p className="text-slate-600 font-medium text-lg">{t('discovery.subtitle')}</p>
          </div>
          <SearchWidget value={searchQuery} onChange={setSearchQuery} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          
          <div className="lg:col-span-1">
            <CategoryFilter
              categories={dbCategories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-20 text-emerald-100 font-medium backdrop-blur-md bg-white/5 rounded-3xl border border-white/10 shadow-inner animate-pulse">
                {t('discovery.loading')}
              </div>
            ) : filteredClubs.length > 0 ? (
              filteredClubs.map((club) => {
                const clubCategory = dbCategories.find((c) => c.id === club.category);
                return (
                  <ClubInfoCard
                    key={club.id}
                    club={club}
                    category={clubCategory}
                    onCategoryClick={setSelectedCategory}
                  />
                );
              })
            ) : (
              <div className="col-span-full text-center py-20 text-emerald-100 font-medium backdrop-blur-md bg-white/5 rounded-3xl border border-white/10 shadow-inner">
                {t('discovery.noClubs')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
