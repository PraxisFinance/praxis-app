"use client";

import { Button } from "@/components/ui/button";

interface InputWithMaxProps {
  value: string;
  onChange: (value: string) => void;
  maxValue: string;
  placeholder?: string;
  disabled?: boolean;
}

export function InputWithMax({
  value,
  onChange,
  maxValue,
  placeholder = "0.00",
  disabled = false,
}: InputWithMaxProps) {
  return (
    <div className="bg-main-grayPurple rounded-[10px] flex items-center px-4 py-3 gap-2">
      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 bg-transparent text-main-darkPurple text-base font-normal placeholder:text-main-darkPurple/40 outline-none disabled:opacity-50"
      />
      <Button
        variant="secondaryBrand"
        onClick={() => onChange(maxValue.replace(/,/g, ""))}
        className="px-4 py-1.5 h-auto"
        disabled={disabled}
      >
        Max
      </Button>
    </div>
  );
}
