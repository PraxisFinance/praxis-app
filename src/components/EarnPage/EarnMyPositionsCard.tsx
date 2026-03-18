import Image from "next/image";
import type { EarnPosition } from "@/shared/types/earn";

interface EarnMyPositionsCardProps {
  item: EarnPosition;
}

export function EarnMyPositionsCard({ item }: EarnMyPositionsCardProps) {
  const isEnded = item.status === "ended";

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
          <span className="text-slate-400 text-2xs font-normal leading-3 uppercase tracking-wide">Your deposite</span>
          <div className="flex items-center gap-1">
            <span className="text-main-darkPurple text-sm leading-4">{item.yourDeposit}</span>
            <Image
              src={item.depositCurrencyIconUrl}
              alt={item.depositCurrency}
              width={16}
              height={16}
              className="w-4 h-4 rounded-full"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-slate-400 text-2xs font-normal leading-3 uppercase tracking-wide">Yield APY</span>
          <span className="text-main-darkPurple text-sm leading-4">{item.yieldApyPercent}%</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-slate-400 text-2xs font-normal leading-3 uppercase tracking-wide">Stake date</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-main-darkPurple text-sm leading-4">{item.stakeTime}</span>
            <span className="text-main-darkPurple text-2xs font-normal leading-3">{item.stakeDate}</span>
          </div>
        </div>
      </div>

      <button
        className={`w-full py-3 rounded-[10px] flex items-center justify-center transition-transform active:scale-[0.98] ${
          isEnded ? "bg-main-purple" : "bg-[#E57373]"
        }`}
      >
        <span className="text-white text-sm leading-4">
          {isEnded ? "Claim deposite" : "Withdraw"}
        </span>
      </button>
    </div>
  );
}
