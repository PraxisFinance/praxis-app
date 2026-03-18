"use client";

import { useState } from "react";
import Image from "next/image";
import { Drawer } from "vaul";
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
        <h2 className="text-indigo-950 text-xl font-medium leading-6">Balances</h2>
        <button onClick={() => setOpen(true)} className="flex items-center justify-center">
          <Image src="/icons/question.png" alt="About balances" width={14} height={14} />
        </button>
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

      <Drawer.Root open={open} onOpenChange={setOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[60]" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-[70] max-w-md mx-auto bg-main-lightGray rounded-t-3xl outline-none">
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-main-grayPurple" />
            </div>

            <div className="px-5 pt-4 pb-10 flex flex-col gap-6">
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
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </section>
  );
}
