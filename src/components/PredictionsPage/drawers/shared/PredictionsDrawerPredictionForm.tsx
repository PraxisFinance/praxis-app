"use client";

import { PredictionsDrawerAmountInput } from "./PredictionsDrawerAmountInput";
import { PredictionsDrawerPlaceButton } from "./PredictionsDrawerPlaceButton";
import { PredictionsDrawerPriceRow } from "./PredictionsDrawerPriceRow";
import { PredictionsDrawerSlippageRow } from "./PredictionsDrawerSlippageRow";

interface PredictionsDrawerPredictionFormProps {
  amount: string;
  onAmountChange: (value: string) => void;
  maxBalance: string;
  priceLabel: string;
  disabled?: boolean;
  unavailableMessage?: string | null;
  errorMessage?: string | null;
  buttonLabel?: string;
  onSubmit: () => void;
  /** When true, the action button is omitted (render it in DrawerShell footer). */
  hideAction?: boolean;
}

export function PredictionsDrawerPredictionForm({
  amount,
  onAmountChange,
  maxBalance,
  priceLabel,
  disabled = false,
  unavailableMessage,
  errorMessage,
  buttonLabel,
  onSubmit,
  hideAction = false,
}: PredictionsDrawerPredictionFormProps) {
  return (
    <div className="flex flex-col gap-4">
      {unavailableMessage ? (
        <p className="text-main-darkPurple/80 text-center text-sm leading-5">{unavailableMessage}</p>
      ) : null}

      <PredictionsDrawerAmountInput
        value={amount}
        onChange={onAmountChange}
        maxValue={maxBalance}
        disabled={disabled}
      />

      <div className="flex flex-col gap-3">
        <PredictionsDrawerSlippageRow disabled={disabled} />
        <PredictionsDrawerPriceRow priceLabel={priceLabel} />
      </div>

      {errorMessage ? (
        <p className="text-main-red text-center text-xs leading-snug" role="alert">
          {errorMessage}
        </p>
      ) : null}

      {!hideAction ? (
        <PredictionsDrawerPlaceButton disabled={disabled} onClick={onSubmit} label={buttonLabel} />
      ) : null}
    </div>
  );
}
