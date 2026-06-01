import { cn } from "@/lib/utils";

interface HubCardShellProps {
  children?: React.ReactNode;
  className?: string;
  "aria-label": string;
}

/** Minimal wrapper until real card UI is implemented. */
export function HubCardShell({ children, className, "aria-label": ariaLabel }: HubCardShellProps) {
  return (
    <article
      aria-label={ariaLabel}
      className={cn(
        "min-h-20 rounded-[5px] border border-main-grayPurple/30 bg-main-lightGray/40",
        className,
      )}
    >
      {children}
    </article>
  );
}
