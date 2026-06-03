"use client";

import Tag from "@/app/components/Tag";
import { useTranslation } from "@/app/contexts/useTranslation";
import { Category } from "@/app/types";

interface ClubTagsProps {
  tags?: string[];
  category?: Category;
  onCategoryClick?: (categoryId: string) => void;
}

export default function ClubTags({ tags, category, onCategoryClick }: ClubTagsProps) {
  const { lang } = useTranslation();

  if ((!tags || tags.length === 0) && !category) return null;

  const categoryName = category
    ? (lang === 'ja' && category.name_ja ? category.name_ja : category.name_en)
    : undefined;

  return (
    <div className="flex flex-wrap gap-1.5">
      {categoryName && (
        <Tag
          tag={categoryName}
          isPrimary={true}
          translate={false}
          onClick={category ? () => onCategoryClick?.(category.id) : undefined}
        />
      )}
      {tags?.map((tag, idx) => (
        <Tag key={idx} tag={tag} isPrimary={false} />
      ))}
    </div>
  );
}
