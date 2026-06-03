"use client";

import { useTranslation } from "@/app/contexts/useTranslation";
import ClubTags from "@/app/components/ClubTags";
import ClubLogo from "@/app/components/ClubLogo";
import ClubCardTitle from "@/app/components/ClubCardTitle";
import ClubCardDescription from "@/app/components/ClubCardDescription";
import DefaultButton from "@/app/components/DefaultButton";

interface InfoCardProps {
  imageUrl?: string;
  imageAlt: string;
  tags?: string[];
  categoryName?: string;
  onCategoryClick?: () => void;
  titleEn: string;
  titleJa?: string;
  instagramUrl?: string;
  descriptionEn?: string;
  descriptionJa?: string;
  buttonText?: string;
  buttonHref?: string;
  onButtonClick?: () => void;
  details?: { label: string; value: string }[];
}

export default function InfoCard({
  imageUrl,
  imageAlt,
  tags = [],
  categoryName,
  onCategoryClick,
  titleEn,
  titleJa,
  instagramUrl,
  descriptionEn,
  descriptionJa,
  buttonText,
  buttonHref,
  onButtonClick,
  details = [],
}: InfoCardProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col group transition-all hover:shadow-xl hover:-translate-y-1">
      {/* Banner / Image */}
      <ClubLogo logoUrl={imageUrl} name={imageAlt} />

      <div className="p-6 flex flex-col flex-grow space-y-4">
        {/* Category */}
        {categoryName && (
          <div className="flex flex-wrap gap-2 items-center">
            <span
              onClick={onCategoryClick}
              className={`text-xs font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded-md transition-colors ${
                onCategoryClick ? "cursor-pointer hover:bg-blue-200" : ""
              }`}
            >
              {categoryName}
            </span>
          </div>
        )}

        {/* Title */}
        <ClubCardTitle
          nameEn={titleEn}
          nameJa={titleJa}
          instagramUrl={instagramUrl}
        />

        {/* Description */}
        {descriptionEn && (
          <ClubCardDescription
            descriptionEn={descriptionEn}
            descriptionJa={descriptionJa}
          />
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md border border-slate-200/40 select-none"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Optional Details (e.g. for facilities) */}
        {details.length > 0 && (
          <div className="space-y-2.5 text-xs font-medium text-slate-650 bg-slate-50 p-4 rounded-xl border border-slate-100/60">
            {details.map((detail, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center border-t border-slate-200/40 first:border-t-0 first:pt-0 pt-2"
              >
                <span className="font-bold text-slate-400 uppercase tracking-wider">
                  {detail.label}
                </span>
                <span className="text-slate-800 font-bold">
                  {detail.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Button */}
        {(onButtonClick || buttonHref) && (
          <DefaultButton
            onClick={onButtonClick}
            href={buttonHref}
            className="w-full mt-auto"
          >
            {buttonText || t("discovery.viewDetails")}
          </DefaultButton>
        )}
      </div>
    </div>
  );
}
