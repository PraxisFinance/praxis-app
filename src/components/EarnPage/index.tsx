"use client";

import { useState, useMemo } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PageSkeleton } from "@/components/ui/skeleton";
import { Balances } from "../Balances/Balances";
import { EarnAvailableCard } from "./EarnAvailableCard";
import { EarnMyPositionsCard } from "./EarnMyPositionsCard";
import { DepositDrawer } from "./DepositDrawer";
import { WithdrawDrawer } from "./WithdrawDrawer";
import { ClaimDrawer } from "./ClaimDrawer";
import { RestakeDrawer } from "./RestakeDrawer";
import { useDepositsStore } from "@/stores/depositsStore";
import {
  vaultStateToAvailableItem,
  userPositionToEarnPosition,
  earnPositionToAvailableItem,
} from "@/shared/utils/earnMappers";
import type { EarnAvailableItem, EarnPosition } from "@/shared/types/earn";

export function EarnPage() {
  const { vaults, loading, getActiveVaults, getUserPositions } = useDepositsStore();

  const [selectedAvailableItem, setSelectedAvailableItem] = useState<EarnAvailableItem | null>(
    null,
  );
  const [depositDrawerOpen, setDepositDrawerOpen] = useState(false);

  const [selectedPosition, setSelectedPosition] = useState<EarnPosition | null>(null);
  const [withdrawDrawerOpen, setWithdrawDrawerOpen] = useState(false);
  const [claimDrawerOpen, setClaimDrawerOpen] = useState(false);
  const [selectedRestakePosition, setSelectedRestakePosition] = useState<EarnPosition | null>(null);
  const [restakeDrawerOpen, setRestakeDrawerOpen] = useState(false);

  const availableItems = useMemo(
    () =>
      [...getActiveVaults()]
        .sort((a, b) => Number(b.maturity - a.maturity))
        .map(vaultStateToAvailableItem),
    [vaults, getActiveVaults],
  );

  const mostRecentActiveVault = useMemo(() => {
    const actives = getActiveVaults();
    if (!actives.length) return null;
    const sorted = [...actives].sort((a, b) => Number(b.maturity - a.maturity));
    return vaultStateToAvailableItem(sorted[0]);
  }, [vaults, getActiveVaults]);

  const myPositions = useMemo(() => {
    return getUserPositions().map((pos) => {
      const vault = vaults[pos.vault_id]?.state ?? null;
      return userPositionToEarnPosition(pos, vault);
    });
  }, [vaults, getUserPositions]);

  function handleDeposit(item: EarnAvailableItem) {
    setSelectedAvailableItem(item);
    setDepositDrawerOpen(true);
  }

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
        <SectionHeader>My positions</SectionHeader>
        <div className="flex flex-col gap-3">
          {loading && myPositions.length === 0 && <PageSkeleton variant="cards" rows={2} />}
          {!loading && myPositions.length === 0 && (
            <p className="text-sm text-gray-400 px-1">No active positions</p>
          )}
          {myPositions.map((item) => (
            <EarnMyPositionsCard
              key={`${item.vaultAddress}-${item.stakeDate}`}
              item={item}
              onDeposit={handleDepositFromPosition}
              onWithdraw={handleWithdraw}
              onClaim={handleClaim}
              onRestake={handleRestake}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <SectionHeader>Available pools</SectionHeader>
        <div className="flex flex-col gap-3">
          {loading && availableItems.length === 0 && <PageSkeleton variant="cards" rows={2} />}
          {!loading && availableItems.length === 0 && (
            <p className="text-sm text-gray-400 px-1">No available pools</p>
          )}
          {availableItems.map((item) => (
            <EarnAvailableCard key={item.vaultAddress} item={item} onDeposit={handleDeposit} />
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
