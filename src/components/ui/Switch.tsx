"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cn } from "@/lib/utils";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function Switch({ checked, onCheckedChange, disabled, className }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full outline-none transition-colors duration-200",
        "bg-main-grayPurple data-[checked]:bg-main-purple",
        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
        className
      )}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "block h-[18px] w-[18px] rounded-full shadow-sm transition-all duration-200",
          "translate-x-1 data-[checked]:translate-x-[26px]",
          "bg-white data-[checked]:bg-[#BEFF5B]"
        )}
      />
    </SwitchPrimitive.Root>
  );
}
