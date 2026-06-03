"use client";

import { useTranslation } from "@/app/contexts/useTranslation";

interface ClubCardDescriptionProps {
  descriptionEn?: string;
  descriptionJa?: string;
}

export default function ClubCardDescription({
  descriptionEn,
  descriptionJa,
}: ClubCardDescriptionProps) {
  const { t, lang } = useTranslation();

  const displayDescription =
    lang === 'ja' && descriptionJa
      ? descriptionJa
      : descriptionEn || t('club.noDescription');

  return (
    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 flex-grow">
      {displayDescription}
    </p>
  );
}
