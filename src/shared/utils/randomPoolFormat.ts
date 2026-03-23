import type { RandomPoolRemainingTime } from "@/shared/types/randomPool";

export function formatRandomPoolRemainingTime(t: RandomPoolRemainingTime): string {
  return `Remain time: ${t.days}d ${t.hours}h ${t.minutes}m ${t.seconds}s`;
}
