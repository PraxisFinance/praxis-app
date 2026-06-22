"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface FilterChipButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isActive: boolean;
  children: ReactNode;
}

export function FilterChipButton({
  isActive,
  children,
  className,
  type = "button",
  ...props
}: FilterChipButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "rounded-[5px] px-3 py-1.5 text-xs font-medium transition-all",
        isActive
          ? "bg-main-purple text-white"
          : "bg-main-lightGray text-main-darkPurple hover:bg-main-grayPurple",
        "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-main-lightGray",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
