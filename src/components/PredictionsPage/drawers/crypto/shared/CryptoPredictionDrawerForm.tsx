"use client";

import { Button } from "@/components/ui/button";
import { InputWithMax } from "@/components/ui/InputWithMax";
import { CryptoPredictionDrawerPriceRow } from "./CryptoPredictionDrawerPriceRow";
import { CryptoPredictionDrawerSlippageRow } from "./CryptoPredictionDrawerSlippageRow";

interface CryptoPredictionDrawerFormProps {
  amount: string;
  onAmountChange: (value: string) => void;
  maxBalance: string;
  priceLabel: string;
  disabled?: boolean;
  unavailableMessage?: string | null;
  errorMessage?: string | null;
  buttonLabel: string;
  onSubmit: () => void;
}

export function CryptoPredictionDrawerForm({
  amount,
  onAmountChange,
  maxBalance,
  priceLabel,
  disabled = false,
  unavailableMessage,
  errorMessage,
  buttonLabel,
  onSubmit,
}: CryptoPredictionDrawerFormProps) {
  return (
    <div className="flex flex-col gap-4">
      {unavailableMessage ? (
        <p className="text-main-darkPurple/80 text-center text-sm leading-5">{unavailableMessage}</p>
      ) : null}

      <InputWithMax
        value={amount}
        onChange={onAmountChange}
        maxValue={maxBalance}
        placeholder="Prediction amount"
        disabled={disabled}
      />

      <div className="flex flex-col gap-3">
        <CryptoPredictionDrawerSlippageRow disabled={disabled} />
        <CryptoPredictionDrawerPriceRow priceLabel={priceLabel} />
      </div>

      {errorMessage ? (
        <p className="text-main-red text-center text-xs leading-snug" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <Button variant="primary" size="action" disabled={disabled} onClick={onSubmit}>
        {buttonLabel}
      </Button>
    </div>
  );
}
