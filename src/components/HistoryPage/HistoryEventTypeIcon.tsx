import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { HistoryEventType } from "@/shared/types/history";
import { DepositIcon } from "@/components/icons/feature/history/depositIcon";
import { WithdrawIcon } from "@/components/icons/feature/history/withdrawIcon";
import { EarnIcon } from "@/components/icons/feature/history/earnIcon";
import { PredictionIcon } from "@/components/icons/feature/history/predictionIcon";
import { PredictionWinningIcon } from "@/components/icons/feature/history/predictionWinningIcon";

export function HistoryEventTypeIcon({
  type,
  className,
}: {
  type: HistoryEventType;
  className?: string;
}) {
  const iconClassName = cn("size-4", className);
  let inner: ReactNode;
  switch (type) {
    case "DEPOSIT":
      inner = <DepositIcon className={iconClassName} />;
      break;
    case "WITHDRAW":
      inner = <WithdrawIcon className={iconClassName} />;
      break;
    case "EARN":
      inner = <EarnIcon className={iconClassName} />;
      break;
    case "PREDICTION":
      inner = <PredictionIcon className={iconClassName} />;
      break;
    case "PREDICTION_WINNING_CLAIM":
      inner = <PredictionWinningIcon className={iconClassName} />;
      break;
  }

  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-full">{inner}</div>
  );
}
