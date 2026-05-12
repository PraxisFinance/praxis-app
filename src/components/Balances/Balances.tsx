"use client";

import { useState } from "react";
import Image from "next/image";
import { HintIcon } from "@/components/icons/base/hintIcon";
import { Button } from "@/components/ui/button";
import { AppDrawerHeading } from "@/components/ui/AppDrawerHeading";
import { DrawerShell } from "@/components/ui/DrawerShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BalanceCard } from "./BalanceCard";
import { BALANCE_INFO } from "@/shared/constants/balances";
import { useWalletBalances } from "@/hooks/useWalletBalances";

export function Balances() {
  const [open, setOpen] = useState(false);
  const { balances } = useWalletBalances();

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

      <DrawerShell open={open} onOpenChange={setOpen}>
        <AppDrawerHeading title="About balance" />

        <div className="flex flex-col gap-5">
          {BALANCE_INFO.map((item) => (
            <div key={item.label} className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <Image src={item.iconUrl} alt={item.label} width={24} height={24} />
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
