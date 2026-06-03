"use client";

import { useTranslation } from "@/app/contexts/useTranslation";
import InstagramButton from "./InstagramButton";

interface ClubCardTitleProps {
  nameEn: string;
  nameJa?: string;
  instagramUrl?: string;
}

export default function ClubCardTitle({ nameEn, nameJa, instagramUrl }: ClubCardTitleProps) {
  const { lang } = useTranslation();

  const displayName = lang === 'ja' && nameJa ? nameJa : nameEn;

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold text-slate-900 leading-snug">
          {displayName}
        </h2>
        {instagramUrl && (
          <InstagramButton instagramUrl={instagramUrl} />
        )}
      </div>
      {lang === 'en' && nameJa && (
        <p className="text-xs font-medium text-slate-400 font-sans">{nameJa}</p>
      )}
    </div>
  );
}
