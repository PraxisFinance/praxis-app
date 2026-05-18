"use client";

import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useDepositsStore } from "@/stores/depositsStore";
import { useActiveVaultStore } from "@/stores/activeVaultStore";

export function ActiveVaultBoot() {
  const { address } = useAccount();
  const fetchAll = useDepositsStore((state) => state.fetchAll);
  const setUserAddress = useActiveVaultStore((state) => state.setUserAddress);

  useEffect(() => {
    setUserAddress(address ?? null);
  }, [address, setUserAddress]);

  useEffect(() => {
    void fetchAll(address);
  }, [address, fetchAll]);

  return null;
}
