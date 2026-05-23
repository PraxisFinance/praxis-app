"use client";

import { useAccount } from "wagmi";
import { useUserHistory } from "@/hooks/useUserHistory";

export function HistoryBoot() {
  // const { address } = useAccount();
  const address = "0x75a9D238a0c924db5f25258C9636007866a1Beae";
  useUserHistory(address);
  return null;
}
