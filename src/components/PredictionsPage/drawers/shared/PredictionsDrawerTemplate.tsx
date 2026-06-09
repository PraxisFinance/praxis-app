"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PredictionsDrawerTemplateProps {
  header?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function PredictionsDrawerTemplate({
  header,
  children,
  className,
}: PredictionsDrawerTemplateProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {header}
      {children}
    </div>
  );
}
