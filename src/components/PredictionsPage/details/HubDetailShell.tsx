import { cn } from "@/lib/utils";

interface HubDetailShellProps {
  children?: React.ReactNode;
  className?: string;
  "aria-label": string;
}

/** Minimal wrapper until category detail UI is implemented. */
export function HubDetailShell({ children, className, "aria-label": ariaLabel }: HubDetailShellProps) {
  return (
    <section
      aria-label={ariaLabel}
      className={cn("min-h-20 rounded-[10px] bg-main-lightGray p-3", className)}
    >
      {children}
    </section>
  );
}
