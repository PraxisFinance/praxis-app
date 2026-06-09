"use client";

import type { ReactNode } from "react";
import { PredictionsDrawerTitle } from "./PredictionsDrawerTitle";

interface PredictionsDrawerHeaderProps {
  trailing?: ReactNode;
}

export function PredictionsDrawerHeader({ trailing }: PredictionsDrawerHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <PredictionsDrawerTitle />
      {trailing}
    </div>
  );
}
