import Image from "next/image";
import type { CurrencyStat } from "@/shared/types/profile";

export function CurrencyStatCard({ stat }: { stat: CurrencyStat }) {
  return (
    <div className="flex flex-1 flex-col justify-between gap-2 rounded-sm bg-main-lightGray p-3">
      <span className="text-xs font-normal text-main-darkPurple/60 leading-4">{stat.label}</span>
      <div className="flex items-center gap-2">
        <Image src="/icons/w-usdc.png" alt="wUSDC" width={20} height={20} className="shrink-0" />
        <span className="text-main-darkPurple text-md tabular-nums leading-6">
          {stat.amount.toLocaleString()}&nbsp;
          <span className="text-sm font-medium">{stat.currency}</span>
        </span>
      </div>
    </div>
  );
}
