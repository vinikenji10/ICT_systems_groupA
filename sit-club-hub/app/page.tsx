"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { useTranslation } from "@/app/contexts/useTranslation";
import { Club, Category } from "@/app/types";
import InfoCard from "@/app/components/InfoCard";
import SearchWidget from "@/app/components/SearchWidget";
import CategoryFilter from "@/app/components/CategoryFilter";

export default function DiscoveryPage() {
  const { t, lang } = useTranslation();
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
          <SearchWidget value={searchQuery} onChange={setSearchQuery} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          <CategoryFilter
            categories={dbCategories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredClubs.length > 0 ? (
              filteredClubs.map((club) => {
                const clubCategory = dbCategories.find((c) => c.id === club.category);
                return (
                  <InfoCard
                    key={club.id}
                    imageUrl={club.logoUrl}
                    imageAlt={club.name_en}
                    tags={club.tags}
                    categoryName={
                      clubCategory
                        ? (lang === 'ja' && clubCategory.name_ja ? clubCategory.name_ja : clubCategory.name_en)
                        : club.category
                    }
                    onCategoryClick={() => setSelectedCategory(club.category)}
                    titleEn={club.name_en}
                    titleJa={club.name_ja}
                    instagramUrl={club.instagramUrl}
                    descriptionEn={club.description_en}
                    descriptionJa={club.description_ja}
                    buttonHref={`/clubs/${club.id}`}
                  />
                );
              })
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
