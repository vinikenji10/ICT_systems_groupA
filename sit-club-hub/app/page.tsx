"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { Club } from "@/app/types";

export default function DiscoveryPage() {
  const router = useRouter();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [filteredClubs, setFilteredClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Engineering", "Esports", "Sports", "Cultural", "Design"];

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "clubs"));
        const clubsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Club[];

        setClubs(clubsData);
        setFilteredClubs(clubsData);
      } catch (error) {
        console.error("Error fetching clubs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  useEffect(() => {
    let result = clubs;

    if (selectedCategory !== "All") {
      result = result.filter((club) => 
        club.category?.toLowerCase() === selectedCategory.toLowerCase() || 
        club.tags?.some(tag => tag.toLowerCase() === selectedCategory.toLowerCase())
      );
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
  }, [searchQuery, selectedCategory, clubs]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d4f37] flex items-center justify-center text-white text-lg">
        Loading communities...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d4f37] p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="bg-white rounded-2xl p-8 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-slate-900">Discover Hidden Communities</h1>
            <p className="text-slate-500 font-medium">Find your passion and join student organizations.</p>
          </div>
          <div className="w-full md:w-96">
            <input
              type="text"
              placeholder="Search clubs, sports, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium bg-slate-50 text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          <div className="bg-white rounded-2xl p-6 shadow-md space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Categories</h3>
            <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-2 lg:pb-0">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap text-sm ${
                    selectedCategory === category
                      ? "bg-emerald-50 text-emerald-700 shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredClubs.length > 0 ? (
              filteredClubs.map((club) => (
                <div
                  key={club.id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col border border-slate-100 group transition-all hover:shadow-xl hover:-translate-y-1"
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
                        Image Placeholder
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
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="space-y-1">
                      <h2 className="text-xl font-bold text-slate-900 leading-snug">{club.name_en}</h2>
                      {club.name_ja && (
                        <p className="text-xs font-medium text-slate-400 font-sans">{club.name_ja}</p>
                      )}
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 flex-grow">
                      {club.description_en || "No description provided yet."}
                    </p>

                    <button
                      onClick={() => router.push(`/clubs/${club.id}`)}
                      className="w-full bg-[#121824] hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl transition-colors text-sm mt-auto"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-emerald-100 font-medium">
                No clubs found matching your criteria.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}