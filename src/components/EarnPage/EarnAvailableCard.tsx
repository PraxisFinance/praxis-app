import Image from "next/image";
import type { EarnAvailableItem } from "@/shared/types/earn";

interface EarnAvailableCardProps {
  item: EarnAvailableItem;
  onDeposit: (item: EarnAvailableItem) => void;
}

export function EarnAvailableCard({ item, onDeposit }: EarnAvailableCardProps) {
  return (
    <div className="w-full bg-main-lightGray rounded-[10px] p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
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
        <span className="text-main-darkPurple text-2xs font-normal leading-3 whitespace-nowrap">
          Pool lifetime: {item.poolLifetime}
        </span>
      </div>

      <div className="flex gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-slate-400 text-2xs font-normal leading-3 uppercase tracking-wide">Deposits</span>
          <span className="text-main-darkPurple text-sm leading-4">
            {item.depositsAmount} {item.depositCurrency}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-slate-400 text-2xs font-normal leading-3 uppercase tracking-wide">Liquidity</span>
          <span className="text-main-darkPurple text-sm leading-4">
            {item.liquidityAmount} {item.depositCurrency}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-slate-400 text-2xs font-normal leading-3 uppercase tracking-wide">Yield APY</span>
          <span className="text-main-darkPurple text-sm leading-4">{item.yieldApyPercent}%</span>
        </div>
      </div>

      <button
        onClick={() => onDeposit(item)}
        className="w-full py-3 bg-[#6FCF97] rounded-[10px] flex items-center justify-center transition-transform active:scale-[0.98]"
      >
        <span className="text-white text-sm leading-4">Deposit</span>
      </button>
    </div>
  );
}
