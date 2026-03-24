"use client";

import { Drawer } from "vaul";
import { cn } from "@/lib/utils";

const titleVariants = {
  default: "text-main-darkPurple text-2xl font-bold leading-tight",
  plain: "text-main-darkPurple text-2xl font-normal leading-tight",
} as const;

export interface AppDrawerHeadingProps {
  title: React.ReactNode;
  /** Renders below the title with standard body styles. */
  description?: React.ReactNode;
  /** `plain` matches drawers that omit bold on the title (e.g. claim / withdraw). */
  variant?: keyof typeof titleVariants;
  /** Merged with variant title classes (e.g. underline). */
  titleClassName?: string;
}

export function AppDrawerHeading({
  title,
  description,
  variant = "default",
  titleClassName,
}: AppDrawerHeadingProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Drawer.Title className={cn(titleVariants[variant], titleClassName)}>{title}</Drawer.Title>
      {description != null && (
        <p className="text-main-darkPurple text-sm font-normal leading-5">{description}</p>
      )}
    </div>
  );
}
