import { ArrowUp, ArrowDown } from "lucide-react";
import type { PredictionHistoryItem } from "@/shared/types/profile";

export function PredictionsHistoryRow({ item }: { item: PredictionHistoryItem }) {
  const isWon = item.result === "won";

  return (
    <div className="flex items-center gap-3 rounded-sm bg-main-lightGray px-3 py-3">
      {/* Result icon — fixed width */}
      <div className="w-8 shrink-0">
        {isWon ? (
          <ArrowUp className="size-5 text-main-success" strokeWidth={2.5} />
        ) : (
          <ArrowDown className="size-5 text-main-red" strokeWidth={2.5} />
        )}
      </div>

      {/* Prediction name — grows to fill remaining space */}
      <span className="flex-1 min-w-0 text-main text-sm truncate">
        {item.prediction}
      </span>

      {/* Date */}
      <span className="w-20 text-main text-xs font-normal tabular-nums shrink-0">
        {item.date}
      </span>

      {/* Amount */}
      <span className="w-24 text-main text-sm tabular-nums whitespace-nowrap shrink-0">
        {isWon
          ? <span className="inline-block w-[10px]" />
          : <span className="text-main-red">−</span>
        }{item.amount}&nbsp;
        <span className="text-xs font-medium text-main">{item.currency}</span>
      </span>
    </div>
  );
}
