import type { ProgressCategoryIconProps } from "@/components/icons/progress/progressIconProps";

export function DiceIcon({ className }: ProgressCategoryIconProps) {
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
      <rect x="4" y="4" width="16" height="16" rx="3" fill="currentColor" />
      <circle cx="9" cy="9" r="1.25" fill="white" />
      <circle cx="15" cy="9" r="1.25" fill="white" />
      <circle cx="12" cy="12" r="1.25" fill="white" />
      <circle cx="9" cy="15" r="1.25" fill="white" />
      <circle cx="15" cy="15" r="1.25" fill="white" />
    </svg>
  );
}
