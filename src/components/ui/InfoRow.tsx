import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const infoRowVariants = cva("", {
  variants: {
    variant: {
      inline:
        "flex items-center justify-between [&_.info-label]:text-main-darkPurple [&_.info-label]:text-sm [&_.info-label]:font-normal [&_.info-label]:leading-5 [&_.info-value]:text-main-darkPurple [&_.info-value]:text-sm [&_.info-value]:font-semibold [&_.info-value]:leading-5",
      stacked:
        "flex flex-col gap-1 [&_.info-label]:text-slate-400 [&_.info-label]:text-2xs [&_.info-label]:font-normal [&_.info-label]:leading-3 [&_.info-label]:uppercase [&_.info-label]:tracking-wide [&_.info-value]:text-main-darkPurple [&_.info-value]:text-sm [&_.info-value]:leading-4",
    },
  },
  defaultVariants: {
    variant: "inline",
  },
});

interface InfoRowProps extends VariantProps<typeof infoRowVariants> {
  label: string;
  value: React.ReactNode;
  className?: string;
}

export function InfoRow({ label, value, variant = "inline", className }: InfoRowProps) {
  return (
    <div className={cn(infoRowVariants({ variant }), className)}>
      <span className="info-label">{label}</span>
      <span className="info-value">{value}</span>
    </div>
  );
}
