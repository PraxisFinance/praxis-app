"use client";

import { useAccount } from "wagmi";
import { useUserHistory } from "@/hooks/useUserHistory";

export function HistoryBoot() {
  const { address } = useAccount();
  useUserHistory(address);
  return null;
}
