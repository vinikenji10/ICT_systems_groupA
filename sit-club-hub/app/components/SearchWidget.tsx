"use client";

import { useTranslation } from "@/app/contexts/useTranslation";

interface SearchWidgetProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchWidget({ value, onChange }: SearchWidgetProps) {
  const { t } = useTranslation();

  return (
    <div className="w-full md:w-96">
      <input
        type="text"
        placeholder={t('discovery.search')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-5 py-3.5 rounded-2xl border border-white/50 focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium bg-white/50 backdrop-blur-md text-slate-800 placeholder-slate-500 shadow-inner transition-all hover:bg-white/60 focus:bg-white/80"
      />
    </div>
  );
}
