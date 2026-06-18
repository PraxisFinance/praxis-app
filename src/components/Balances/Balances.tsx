"use client";

import { useState } from "react";
import Image from "next/image";
import { HintIcon, UsdcTokenIcon, WUsdcTokenIcon, YtTokenIcon } from "@/components/icons/base";
import { Button } from "@/components/ui/button";
import { AppDrawerHeading } from "@/components/ui/AppDrawerHeading";
import { DrawerShell } from "@/components/ui/DrawerShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BalanceCard } from "./BalanceCard";
import { BALANCE_INFO } from "@/shared/constants/balances";
import { isUsdcIconUrl, isWUsdcIconUrl, isYtIconUrl } from "@/shared/constants/tokenIconUrls";
import { useWalletBalances } from "@/hooks/useWalletBalances";
import { useMintTestnetUsdc } from "@/hooks/useMintTestnetUsdc";

export function Balances() {
  const [open, setOpen] = useState(false);
  const { balances, raw, isLoading, refetchAfterDelay, isConnected } = useWalletBalances();

  const allZero =
    !isLoading &&
    isConnected &&
    raw.usdc === BigInt(0) &&
    raw.pt === BigInt(0) &&
    raw.yt === BigInt(0);

  const { mint, isPending } = useMintTestnetUsdc(refetchAfterDelay);

  return (
    <section>
      <div className="flex items-center mb-2">
        <SectionHeader>Balances</SectionHeader>
        <Button variant="ghost" size="icon-sm" onClick={() => setOpen(true)} className="p-1" aria-label="About balances">
          <HintIcon className="text-main-darkPurple h-3.5 w-3.5" aria-hidden />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {balances.map((balance) => (
          <BalanceCard
            key={balance.label}
            label={balance.label}
            value={balance.value}
            iconUrl={balance.iconUrl}
          />
        ))}
      </div>

      {allZero && !isPending && (
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={mint}
        >
          Top up testnet balance
        </Button>
      )}

      <DrawerShell open={open} onOpenChange={setOpen}>
        <AppDrawerHeading title="About balance" />

        <div className="flex flex-col gap-5">
          {BALANCE_INFO.map((item) => (
            <div key={item.label} className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                {isUsdcIconUrl(item.iconUrl) ? (
                  <span className="inline-flex shrink-0" aria-hidden>
                    <UsdcTokenIcon />
                  </span>
                ) : isWUsdcIconUrl(item.iconUrl) ? (
                  <span className="inline-flex shrink-0" aria-hidden>
                    <WUsdcTokenIcon />
                  </span>
                ) : isYtIconUrl(item.iconUrl) ? (
                  <span className="inline-flex shrink-0" aria-hidden>
                    <YtTokenIcon />
                  </span>
                ) : (
                  <Image src={item.iconUrl} alt={item.label} width={24} height={24} />
                )}
                <span className="text-main-darkPurple text-base font-semibold leading-5">
                  {item.label}
                </span>
              </div>
              <p className="text-main-darkPurple text-sm font-normal leading-5">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </DrawerShell>
    </section>
  );
}
