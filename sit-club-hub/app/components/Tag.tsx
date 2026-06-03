"use client";

import { useTranslation } from "@/app/contexts/useTranslation";

interface TagProps {
  tag: string;
  isPrimary?: boolean;
  translate?: boolean;
  onClick?: () => void;
}

export default function Tag({ tag, isPrimary = false, translate = true, onClick }: TagProps) {
  const { tt } = useTranslation();

  return (
    <span
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
      className={`text-[11px] font-bold px-2.5 py-1 rounded-md tracking-wide transition-colors ${
        isPrimary
          ? `bg-blue-50 text-blue-700 ${onClick ? "hover:bg-blue-100 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-400" : ""}`
          : `bg-slate-100 text-slate-600 ${onClick ? "hover:bg-slate-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-300" : ""}`
      }`}
    >
      {translate ? tt(tag) : tag}
    </span>
  );
}
