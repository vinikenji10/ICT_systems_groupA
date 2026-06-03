"use client";

import { useTranslation } from "@/app/contexts/useTranslation";

interface ClubLogoProps {
  logoUrl?: string;
  name: string;
}

export default function ClubLogo({ logoUrl, name }: ClubLogoProps) {
  const { t } = useTranslation();

  return (
    <div className="h-48 w-full bg-slate-100 relative overflow-hidden shrink-0 border-b border-slate-100">
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={`Logo of ${name}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm font-medium">
          {t('discovery.imagePlaceholder')}
        </div>
      )}
    </div>
  );
}
