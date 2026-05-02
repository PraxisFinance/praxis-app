"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "rounded-lg bg-primary text-primary-foreground active:translate-y-px [a]:hover:bg-primary/80",
        outline:
          "rounded-lg border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50 active:translate-y-px",
        secondary:
          "rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground active:translate-y-px",
        ghost:
          "rounded-lg hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 active:translate-y-px",
        destructive:
          "rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40 active:translate-y-px",
        link: "rounded-lg text-primary underline-offset-4 hover:underline",
        // Brand variants
        primary:
          "rounded-[6px] bg-main-purple text-white hover:bg-main-purple/90 transition-transform active:scale-[0.98]",
        success:
          "rounded-[6px] bg-main-success/60 text-white hover:bg-main-success/90 transition-transform active:scale-[0.98]",
        destructiveBrand:
          "rounded-[10px] bg-main-destructive text-white hover:bg-main-destructive/90 transition-transform active:scale-[0.98]",
        destructiveMuted:
          "rounded-[6px] bg-main-red/60 text-white hover:bg-main-red/70 transition-transform active:scale-[0.98]",
        secondaryBrand:
          "rounded-[6px] bg-main-lightGray text-main-darkPurple hover:bg-main-grayPurple transition-transform active:scale-[0.97]",
        pillPrimary:
          "rounded-[6px] bg-main-purple text-white hover:bg-main-purple/90 transition-transform active:scale-[0.98]",
        pillSecondary:
          "rounded-[30px] bg-main-lightGray text-main-darkPurple hover:bg-main-grayPurple transition-transform active:scale-[0.98]",
        iconPill: "rounded-[30px] bg-slate-200 hover:bg-slate-300 transition-colors p-[5px]",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
        // Brand sizes
        action: "w-full py-2 gap-0",
        pill: "px-4 py-2 gap-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
