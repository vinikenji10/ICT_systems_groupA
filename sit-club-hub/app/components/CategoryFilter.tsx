"use client";

import { useTranslation } from "@/app/contexts/useTranslation";
import { Category } from "@/app/types";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  const { t, lang } = useTranslation();

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-xl space-y-4">
      <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider px-2">
        {t('discovery.categories')}
      </h3>
      <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-2 lg:pb-0">
        <button
          key="All"
          onClick={() => onSelectCategory("All")}
          className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap text-sm cursor-pointer ${
            selectedCategory === "All"
              ? "bg-primary/90 text-white shadow-md backdrop-blur-sm"
              : "text-slate-600 hover:bg-white/60 hover:text-slate-900"
          }`}
        >
          {t('discovery.catAll')}
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap text-sm cursor-pointer ${
              selectedCategory === category.id
                ? "bg-primary/90 text-white shadow-md backdrop-blur-sm"
                : "text-slate-600 hover:bg-white/60 hover:text-slate-900"
            }`}
          >
            {lang === 'ja' && category.name_ja ? category.name_ja : category.name_en}
          </button>
        ))}
      </div>
    </div>
  );
}
