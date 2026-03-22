import { cn } from "@/lib/utils";

export type ProgressBarVariant = "live" | "ended";

export interface ProgressBarProps {
  /** 0–100 */
  value: number;
  variant?: ProgressBarVariant;
  className?: string;
}

export function ProgressBar({ value, variant = "live", className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-main-grayPurple", className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width]",
          variant === "live" ? "bg-main-success/90" : "bg-main-purple/90"
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
