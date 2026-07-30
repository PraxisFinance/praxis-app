import { YtTokenIcon } from "@/components/icons/base";
import type { CurrencyStat } from "@/shared/types/profile";

export function CurrencyStatCard({ stat }: { stat: CurrencyStat }) {
  return (
    <div className="flex flex-1 flex-col gap-1 rounded-sm bg-main-lightGray p-3">
      <span className="whitespace-nowrap text-xs font-normal leading-4 text-main-darkPurple/60">
        {stat.label}
      </span>
      <div className="flex items-center gap-2">
        <span className="inline-flex shrink-0" aria-hidden>
          <YtTokenIcon size={18} />
        </span>
        <span className="text-main-darkPurple text-md tabular-nums leading-6">
          {stat.amount.toLocaleString()}&nbsp;
          <span className="text-sm font-medium">{stat.currency}</span>
        </span>
      </div>
    </div>
  );
}
