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
        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium bg-slate-50 text-slate-800 placeholder-slate-400"
      />
    </div>
  );
}
