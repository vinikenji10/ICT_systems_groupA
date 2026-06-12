"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "@/app/contexts/useTranslation";
import { Club, Category } from "@/app/types";
import ClubTags from "@/app/components/ClubTags";
import ClubLogo from "@/app/components/ClubLogo";
import ClubCardTitle from "@/app/components/ClubCardTitle";
import ClubCardDescription from "@/app/components/ClubCardDescription";
import DefaultButton from "@/app/components/DefaultButton";

interface ClubInfoCardProps {
  club: Club;
  category?: Category;
  onCategoryClick?: (categoryId: string) => void;
}

export default function ClubInfoCard({ club, category, onCategoryClick }: ClubInfoCardProps) {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div
      className="bg-white/80 backdrop-blur-md border border-white/30 rounded-3xl shadow-lg overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:bg-white/90"
    >
      <ClubLogo logoUrl={club.logoUrl} name={club.name_en} />

      <div className="p-6 flex flex-col flex-grow space-y-4">
        <ClubTags tags={club.tags} category={category} onCategoryClick={onCategoryClick} />

        <ClubCardTitle
          nameEn={club.name_en}
          nameJa={club.name_ja}
          instagramUrl={club.instagramUrl}
        />

        <ClubCardDescription
          descriptionEn={club.description_en}
          descriptionJa={club.description_ja}
        />

        <DefaultButton
          onClick={() => router.push(`/club?id=${club.id}`)}
          className="w-full mt-auto"
        >
          {t('discovery.viewDetails')}
        </DefaultButton>
      </div>
    </div>
  );
}
