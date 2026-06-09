"use client";

import { InputWithMax } from "@/components/ui/InputWithMax";

interface PredictionsDrawerAmountInputProps {
  value: string;
  onChange: (value: string) => void;
  maxValue: string;
  disabled?: boolean;
  placeholder?: string;
}

export function PredictionsDrawerAmountInput({
  value,
  onChange,
  maxValue,
  disabled = false,
  placeholder = "Prediction amount",
}: PredictionsDrawerAmountInputProps) {
  return (
    <InputWithMax
      value={value}
      onChange={onChange}
      maxValue={maxValue}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
}
