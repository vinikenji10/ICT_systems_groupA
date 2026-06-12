"use client";

import { useState } from "react";
import { useTranslation } from "@/app/contexts/useTranslation";
import Image from "next/image";

interface ClubLogoProps {
  logoUrl?: string;
  name: string;
}

export default function ClubLogo({ logoUrl, name }: ClubLogoProps) {
  const { t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);

  const finalLogoUrl = logoUrl?.includes("shibaura_logo.png") ? "/shibaura_logo.png" : logoUrl;

  return (
    <div className="h-48 w-full bg-slate-100 relative overflow-hidden shrink-0 border-b border-slate-100 flex items-center justify-center">
      {finalLogoUrl ? (
        <>
          {!isLoaded && (
            <div className="absolute inset-0 bg-slate-100 animate-pulse" />
          )}
          <Image
            src={finalLogoUrl}
            alt={`Logo of ${name}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onLoad={() => setIsLoaded(true)}
            className={`object-cover transition-all duration-700 ease-in-out group-hover:scale-105 ${
              isLoaded ? "opacity-100 blur-0" : "opacity-0 blur-md"
            }`}
            unoptimized={true}
          />
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm font-medium">
          {t('discovery.imagePlaceholder')}
        </div>
      )}
    </div>
  );
}
