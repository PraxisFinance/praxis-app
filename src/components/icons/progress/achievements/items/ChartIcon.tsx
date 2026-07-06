import type { ProgressCategoryIconProps } from "@/components/icons/progress/progressIconProps";

export function ChartIcon({ className }: ProgressCategoryIconProps) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect x="5" y="12" width="3.5" height="7" rx="1" fill="currentColor" />
      <rect x="10.25" y="8" width="3.5" height="11" rx="1" fill="currentColor" />
      <rect x="15.5" y="5" width="3.5" height="14" rx="1" fill="currentColor" />
    </svg>
  );
}
