"use client";

import Image from "next/image";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";

import { Badge } from "@/components/ui/badge";
import { ArrowIcon } from "@/components/ui";
import { cn } from "@/lib/utils";

const menuCardVariants = cva(
  "relative w-full bg-slate-200 rounded-[5px] overflow-hidden flex flex-col justify-between p-2.5 transition-transform active:scale-[0.98]",
  {
    variants: {
      size: {
        sm: "h-28",
        lg: "h-36",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  }
);

const contentVariants = cva("relative z-10 flex flex-col", {
  variants: {
    size: {
      sm: "gap-1 [&_.menu-title]:text-sm [&_.menu-desc]:text-2xs",
      lg: "gap-1.5 [&_.menu-title]:text-xs [&_.menu-desc]:text-[10px] [&_.menu-desc]:w-40",
    },
  },
  defaultVariants: {
    size: "sm",
  },
});

interface MenuCardProps extends VariantProps<typeof menuCardVariants> {
  title?: string;
  description?: string;
  backgroundImage?: string;
  redirectUrl?: string;
  redirectLabel?: string;
}

export function MenuCard({
  title,
  description,
  backgroundImage,
  redirectUrl,
  redirectLabel,
  size = "sm",
}: MenuCardProps) {
  return (
    <Link href={redirectUrl ?? ""} className={cn(menuCardVariants({ size }))}>
      {backgroundImage && (
        <Image src={backgroundImage} alt={title ?? ""} fill className="object-cover" />
      )}

      <div className={cn(contentVariants({ size }))}>
        {title && <span className="menu-title text-indigo-950 font-medium leading-4">{title}</span>}
        {description && (
          <span className="menu-desc text-indigo-950 font-normal leading-3">{description}</span>
        )}
      </div>

      {redirectLabel && (
        <Badge variant="accent" className="relative z-10 self-start text-2xs leading-3">
          {redirectLabel}
          <ArrowIcon className="w-4 h-4" />
        </Badge>
      )}
    </Link>
  );
}
