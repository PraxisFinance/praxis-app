"use client";

import { useState } from "react";
import Image from "next/image";
import { Drawer } from "vaul";
import type { EarnAvailableItem } from "@/shared/types/earn";
import { DEFAULT_BALANCES } from "@/shared/constants/balances";

interface DepositDrawerProps {
  item: EarnAvailableItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DepositDrawer({ item, open, onOpenChange }: DepositDrawerProps) {
  const [amount, setAmount] = useState("");

  if (!item) return null;

  const walletBalance =
    DEFAULT_BALANCES.find((b) => b.iconUrl === item.depositCurrencyIconUrl)?.value ?? "0.000";

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[60]" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-[70] max-w-md mx-auto bg-main-lightGray rounded-t-3xl outline-none">
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-main-grayPurple" />
          </div>

          <div className="px-5 pt-4 pb-10 flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <Drawer.Title className="text-main-darkPurple text-2xl font-bold leading-tight">
                Deposit your cryptocurrency
              </Drawer.Title>
              <p className="text-main-darkPurple text-sm font-normal leading-5">
                Deposit cryptocurrency from your wallet into the vault to start earn.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-main-darkPurple text-lg font-bold leading-6">Pool Information</span>

              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2.5">
                  <Image
                    src={item.depositCurrencyIconUrl}
                    alt={item.depositCurrency}
                    width={36}
                    height={36}
                    className="w-9 h-9 rounded-full shrink-0"
                  />
                  <span className="text-main-darkPurple text-base font-semibold leading-5">{item.queueName}</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  {[
                    { label: "Deposits:",      value: `${item.depositsAmount} ${item.depositCurrency}` },
                    { label: "Liquidity:",     value: `${item.liquidityAmount} ${item.depositCurrency}` },
                    { label: "Yield Apy:",     value: `${item.yieldApyPercent}%` },
                    { label: "Pool lifetime:", value: item.poolLifetime },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-main-darkPurple text-sm font-normal leading-5">{label}</span>
                      <span className="text-main-darkPurple text-sm font-semibold leading-5">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-main-darkPurple text-lg font-bold leading-6">Amount</span>

              <div className="bg-main-grayPurple rounded-[10px] flex items-center px-4 py-3 gap-2">
                <input
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 bg-transparent text-main-darkPurple text-base font-normal placeholder:text-main-darkPurple/40 outline-none"
                />
                <button
                  onClick={() => setAmount(walletBalance.replace(/,/g, ""))}
                  className="px-4 py-1.5 bg-main-lightGray rounded-[6px] text-main-darkPurple text-sm font-semibold leading-4 transition-transform active:scale-[0.97]"
                >
                  Max
                </button>
              </div>

              <div className="flex items-center justify-between px-1">
                <span className="text-main-darkPurple text-xs font-normal leading-4">
                  Available: {walletBalance} ${item.depositCurrency}
                </span>
                <span className="text-main-darkPurple text-xs font-normal leading-4">
                  APY: {item.yieldApyPercent}%&nbsp;&nbsp;Payment %: {item.ytPayoutTime}
                </span>
              </div>
            </div>

            <button className="w-full py-3 bg-[#6FCF97] rounded-[10px] flex items-center justify-center transition-transform active:scale-[0.98]">
              <span className="text-white text-sm leading-4">Deposit</span>
            </button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
