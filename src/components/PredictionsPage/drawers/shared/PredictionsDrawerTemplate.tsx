"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PredictionsDrawerTemplateProps {
  children: ReactNode;
  className?: string;
}

export function PredictionsDrawerTemplate({ children, className }: PredictionsDrawerTemplateProps) {
  return <div className={cn("flex flex-col gap-2", className)}>{children}</div>;
}
