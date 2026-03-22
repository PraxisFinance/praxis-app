"use client";

import { useState } from "react";
import Image from "next/image";
import { Drawer } from "vaul";
import { Button } from "@/components/ui/button";
import { DrawerShell } from "@/components/ui/DrawerShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BalanceCard } from "./BalanceCard";
import type { Balance } from "@/shared/types/balances";
import { DEFAULT_BALANCES, BALANCE_INFO } from "@/shared/constants/balances";

interface BalancesProps {
  balances?: Balance[];
}

export function Balances({ balances = DEFAULT_BALANCES }: BalancesProps) {
  const [open, setOpen] = useState(false);

  return (
    <section>
      <div className="flex items-center gap-2 mb-2">
        <SectionHeader>Balances</SectionHeader>
        <Button variant="ghost" size="icon-sm" onClick={() => setOpen(true)} className="p-1">
          <Image src="/icons/question.png" alt="About balances" width={14} height={14} />
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
        <Drawer.Title className="text-main-darkPurple text-2xl font-bold leading-tight">
          About balance
        </Drawer.Title>

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
