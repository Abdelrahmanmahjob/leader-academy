"use client";

import { useTranslations } from "next-intl";
import {
  AGE_GROUPS,
  getAgeGroupTranslationKey,
  type AgeGroup,
} from "@/content/ageGroups";

type AgeGroupListProps = {
  ageGroups?: readonly AgeGroup[];
  className?: string;
};

export function AgeGroupList({
  ageGroups = AGE_GROUPS,
  className = "",
}: AgeGroupListProps) {
  const t = useTranslations("ageGroups");

  return (
    <p
      data-reveal
      className={`inline-flex items-center gap-1.5 rounded-full border border-accent bg-accent px-3 py-1.5 text-sm font-bold text-inverse ${className}`}
    >
      <span>{t("label")}:</span>
      {ageGroups
        .map((ageGroup) => t(`groups.${getAgeGroupTranslationKey(ageGroup)}`))
        .join(" · ")}
    </p>
  );
}
