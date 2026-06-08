"use client";

import { useTranslation } from '@/app/contexts/useTranslation';
import { Building } from '../../page';

interface BuildingBannerProps {
  building: Building;
}

export default function BuildingBanner({ building }: BuildingBannerProps) {
  const { lang } = useTranslation();

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col relative h-full min-h-[320px] max-h-[380px]">
      {/* Building Banner */}
      <div className="h-full w-full bg-slate-800 relative overflow-hidden flex items-center justify-center shrink-0 min-h-[320px] max-h-[380px]">
        {building.imageUrl ? (
          <img
            src={building.imageUrl}
            alt={`Banner photo of ${building.name_en}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-slate-400 font-medium">No Image Available</span>
        )}
        {/* Dark Transparent Layer Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-10" />

        {/* Building Title Overlaid on Image */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20 text-white flex flex-col justify-end">
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight drop-shadow-lg">
            {lang === 'ja' ? building.name_ja : building.name_en}
          </h1>
          {lang === 'en' && building.name_ja && (
            <h2 className="text-base md:text-lg text-white/80 font-bold mt-1 drop-shadow-sm">{building.name_ja}</h2>
          )}
          {lang === 'ja' && building.name_en && (
            <h2 className="text-base md:text-lg text-white/80 font-bold mt-1 drop-shadow-sm">{building.name_en}</h2>
          )}
        </div>
      </div>
    </div>
  );
}
