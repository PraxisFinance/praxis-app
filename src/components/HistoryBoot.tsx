"use client";

import { useUserHistory } from "@/hooks/useUserHistory";

export function HistoryBoot() {
  useUserHistory();
  return null;
}
