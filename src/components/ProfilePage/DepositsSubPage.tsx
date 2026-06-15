"use client";

import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { Balances } from "../Balances/Balances";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EarnMyPositionsCard } from "../EarnPage/EarnMyPositionsCard";
import { DepositDrawer } from "../EarnPage/DepositDrawer";
import { WithdrawDrawer } from "../EarnPage/WithdrawDrawer";
import { ClaimDrawer } from "../EarnPage/ClaimDrawer";
import { RestakeDrawer } from "../EarnPage/RestakeDrawer";
import { useDepositsStore } from "@/stores/depositsStore";
import {
  userPositionToEarnPosition,
  earnPositionToAvailableItem,
  vaultStateToAvailableItem,
} from "@/shared/utils/earnMappers";
import type { EarnAvailableItem, EarnPosition } from "@/shared/types/earn";

export function DepositsSubPage() {
  const { address } = useAccount();
  //const { vaults, loading, fetchAll, fetchUserDataForAllVaults, getUserPositions } = useDepositsStore();
  const { vaults, loading, fetchAll, getUserPositions, getActiveVaults } = useDepositsStore();
  const [selectedAvailableItem, setSelectedAvailableItem] = useState<EarnAvailableItem | null>(
    null,
  );
  const [depositDrawerOpen, setDepositDrawerOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<EarnPosition | null>(null);
  const [withdrawDrawerOpen, setWithdrawDrawerOpen] = useState(false);
  const [claimDrawerOpen, setClaimDrawerOpen] = useState(false);
  const [selectedRestakePosition, setSelectedRestakePosition] = useState<EarnPosition | null>(null);
  const [restakeDrawerOpen, setRestakeDrawerOpen] = useState(false);

  useEffect(() => {
    fetchAll(address);
  }, [address, fetchAll]);

  const vaultCount = Object.keys(vaults).length;
  // useEffect(() => {
  //   if (address && vaultCount > 0) {
  //     fetchUserDataForAllVaults(address);
  //   }
  // }, [address, vaultCount, fetchUserDataForAllVaults]);

  const mostRecentActiveVault = useMemo(() => {
    const actives = getActiveVaults();
    if (!actives.length) return null;
    const sorted = [...actives].sort((a, b) => Number(b.maturity - a.maturity));
    return vaultStateToAvailableItem(sorted[0]);
  }, [vaults, getActiveVaults]);

  const positions = useMemo(() => {
    return getUserPositions().map((pos) => {
      const vault = vaults[pos.vault_id]?.state ?? null;
      return userPositionToEarnPosition(pos, vault);
    });
  }, [vaults, getUserPositions]);

  function handleWithdraw(item: EarnPosition) {
    setSelectedPosition(item);
    setWithdrawDrawerOpen(true);
  }

  function handleClaim(item: EarnPosition) {
    setSelectedPosition(item);
    setClaimDrawerOpen(true);
  }

  function handleDepositFromPosition(item: EarnPosition) {
    setSelectedAvailableItem(earnPositionToAvailableItem(item));
    setDepositDrawerOpen(true);
  }

  function handleRestake(item: EarnPosition) {
    setSelectedRestakePosition(item);
    setRestakeDrawerOpen(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <Balances />

      <section className="flex flex-col gap-3">
        <SectionHeader>Deposits</SectionHeader>

        <div className="flex flex-col gap-3">
          {loading && positions.length === 0 && (
            <p className="px-1 text-sm text-gray-400">Loading deposits...</p>
          )}
          {!loading && positions.length === 0 && (
            <p className="px-1 text-sm text-gray-400">No deposits yet</p>
          )}
          {positions.map((item) => (
            <EarnMyPositionsCard
              key={`${item.queueName}-${item.stakeDate}`}
              item={item}
              onDeposit={handleDepositFromPosition}
              onWithdraw={handleWithdraw}
              onClaim={handleClaim}
              onRestake={handleRestake}
            />
          ))}
        </div>
      </section>

      <DepositDrawer
        item={selectedAvailableItem}
        open={depositDrawerOpen}
        onOpenChange={setDepositDrawerOpen}
      />
      <WithdrawDrawer
        item={selectedPosition}
        open={withdrawDrawerOpen}
        onOpenChange={setWithdrawDrawerOpen}
      />
      <ClaimDrawer
        item={selectedPosition}
        open={claimDrawerOpen}
        onOpenChange={setClaimDrawerOpen}
      />
      <RestakeDrawer
        item={selectedRestakePosition}
        targetVault={mostRecentActiveVault}
        open={restakeDrawerOpen}
        onOpenChange={setRestakeDrawerOpen}
      />
    </div>
  );
}
