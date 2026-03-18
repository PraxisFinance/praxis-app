"use client";

import Image from "next/image";
import { Drawer } from "vaul";
import type { EarnPosition } from "@/shared/types/earn";

interface ClaimDrawerProps {
  item: EarnPosition | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClaimDrawer({ item, open, onOpenChange }: ClaimDrawerProps) {
  if (!item) return null;

  const claimableAmount = (Number(item.yourDeposit) + Number(item.yieldGenerated)).toString();

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
              <Drawer.Title className="text-main-darkPurple text-2xl leading-tight">
                Claim your deposit from ended vault
              </Drawer.Title>
              <p className="text-main-darkPurple text-sm font-normal leading-5">
                Withdraw your cryptocurrency from ended pool vault.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-main-darkPurple text-lg leading-6">Pool Information</span>

              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2.5">
                  <Image
                    src={item.depositCurrencyIconUrl}
                    alt={item.depositCurrency}
                    width={36}
                    height={36}
                    className="w-9 h-9 rounded-full shrink-0"
                  />
                  <span className="text-main-darkPurple text-base leading-5">{item.queueName}</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  {[
                    { label: "Your deposit:", value: `${item.yourDeposit} ${item.depositCurrency}` },
                    { label: "Yield APY:", value: `${item.yieldApyPercent}%` },
                    { label: "Yield generated:", value: `${item.yieldGenerated} ${item.depositCurrency}` },
                    { label: "Stake date:", value: `${item.stakeTime} ${item.stakeDate}` },
                    { label: "Pool lifetime:", value: item.poolLifetime },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-main-darkPurple text-sm font-normal leading-5">{label}</span>
                      <span className="text-main-darkPurple text-sm leading-5">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* <div className="flex flex-col gap-2">
              <span className="text-main-darkPurple text-lg leading-6">Claimable amount</span>
              <div className="bg-main-grayPurple rounded-[10px] px-4 py-4">
                <span className="text-main-darkPurple text-2xl leading-8">
                  {claimableAmount} {item.depositCurrency}
                </span>
              </div>
              <span className="text-main-darkPurple text-xs font-normal leading-4 px-1">
                Yield generated: {item.yieldGenerated} {item.depositCurrency}
              </span>
            </div> */}

            <button className="w-full py-3 bg-main-purple rounded-[10px] flex items-center justify-center transition-transform active:scale-[0.98]">
              <span className="text-white text-sm leading-4">Claim Funds</span>
            </button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
