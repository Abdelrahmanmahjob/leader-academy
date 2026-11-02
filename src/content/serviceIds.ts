export const SERVICE_IDS = [
  "strength",
  "cardio",
  "mobility",
  "football",
  "women-strength",
  "women-cardio",
  "women-mobility",
  "women-football",
] as const;

export type ServiceId = (typeof SERVICE_IDS)[number];

export function isServiceId(service: string): service is ServiceId {
  return SERVICE_IDS.some((id) => id === service);
}
