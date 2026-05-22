"use client";

import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useDepositsStore, loadMockDeposits } from "@/stores/depositsStore";
import { useActiveVaultStore } from "@/stores/activeVaultStore";

const USE_EARN_MOCKS = process.env.NEXT_PUBLIC_USE_EARN_MOCKS === "true";

export function ActiveVaultBoot() {
  const { address } = useAccount();
  const fetchAll = useDepositsStore((state) => state.fetchAll);
  const setUserAddress = useActiveVaultStore((state) => state.setUserAddress);

  useEffect(() => {
    setUserAddress(address ?? null);
  }, [address, setUserAddress]);

  useEffect(() => {
    if (USE_EARN_MOCKS) {
      loadMockDeposits();
      return;
    }
    void fetchAll(address);
  }, [address, fetchAll]);

  return null;
}
