import type { ClassType } from "./TimeTableData";
import { isServiceId, type ServiceId } from "./serviceIds";

export const AGE_GROUPS = ["10-12", "13-15", "16-18", "19-21"] as const;

export type AgeGroup = (typeof AGE_GROUPS)[number];

export function isAgeGroup(value: string): value is AgeGroup {
  return AGE_GROUPS.some((ageGroup) => ageGroup === value);
}

export const SERVICE_AGE_GROUPS: Readonly<
  Record<ServiceId, readonly AgeGroup[]>
> = {
  strength: ["10-12"],
  cardio: ["13-15"],
  mobility: ["16-18"],
  football: ["19-21"],
  "women-strength": ["10-12"],
  "women-cardio": ["13-15"],
  "women-mobility": ["16-18"],
  "women-football": ["19-21"],
};

export function getServiceIdFromHref(href: string): ServiceId {
  const serviceId = href.slice(href.lastIndexOf("/") + 1);
  if (!isServiceId(serviceId)) {
    throw new Error(`Unknown service path: ${href}`);
  }
  return serviceId;
}

export function getServiceIdForClass(
  audience: "men" | "women",
  type: ClassType,
): ServiceId {
  if (audience === "men") return type;

  switch (type) {
    case "strength":
      return "women-strength";
    case "cardio":
      return "women-cardio";
    case "mobility":
      return "women-mobility";
    case "football":
      return "women-football";
  }
}

export function getServiceAgeGroups(serviceId: ServiceId) {
  return SERVICE_AGE_GROUPS[serviceId];
}

const ageGroupTranslationKeys: Record<
  AgeGroup,
  "tenToTwelve" | "thirteenToFifteen" | "sixteenToEighteen" | "nineteenToTwentyOne"
> = {
  "10-12": "tenToTwelve",
  "13-15": "thirteenToFifteen",
  "16-18": "sixteenToEighteen",
  "19-21": "nineteenToTwentyOne",
};

export function getAgeGroupTranslationKey(ageGroup: AgeGroup) {
  return ageGroupTranslationKeys[ageGroup];
}
