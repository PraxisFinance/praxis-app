"use client";

import { AppDrawerHeading } from "@/components/ui/AppDrawerHeading";
import { DrawerShell } from "@/components/ui/DrawerShell";

export interface ProgressInfoDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  paragraphs: readonly string[];
}

export function ProgressInfoDrawer({
  open,
  onOpenChange,
  title,
  paragraphs,
}: ProgressInfoDrawerProps) {
  return (
    <DrawerShell open={open} onOpenChange={onOpenChange}>
      <AppDrawerHeading title={title} variant="plain" />

      <div className="flex flex-col gap-5">
        {paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-main-darkPurple text-header-6 font-normal leading-5">
            {paragraph}
          </p>
        ))}
      </div>
    </DrawerShell>
  );
}
