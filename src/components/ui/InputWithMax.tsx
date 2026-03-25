"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    <div
      className={cn(
        "flex items-center gap-2 rounded-[10px] bg-main-grayPurple px-4 py-3",
        disabled && "opacity-55"
      )}
    >
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
        disabled={disabled}
        onClick={() => onChange(maxValue.replace(/,/g, ""))}
        className="h-auto px-4 py-1.5"
      >
        Max
      </Button>
    </div>
  );
}
