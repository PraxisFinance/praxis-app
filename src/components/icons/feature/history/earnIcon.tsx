import { cn } from "@/lib/utils";

/** Percent / earn indicator for history rows (not the bottom-nav Earn lightning). */
export function EarnIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("shrink-0", className)}
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.875 3.125L3.125 11.875"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.0625 5.625C4.92544 5.625 5.625 4.92544 5.625 4.0625C5.625 3.19956 4.92544 2.5 4.0625 2.5C3.19956 2.5 2.5 3.19956 2.5 4.0625C2.5 4.92544 3.19956 5.625 4.0625 5.625Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.9375 12.5C11.8004 12.5 12.5 11.8004 12.5 10.9375C12.5 10.0746 11.8004 9.375 10.9375 9.375C10.0746 9.375 9.375 10.0746 9.375 10.9375C9.375 11.8004 10.0746 12.5 10.9375 12.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
