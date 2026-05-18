import type { BottomNavIconProps } from "./navIconProps";

export function EarnIcon({ className = "w-6 h-6", active = false }: BottomNavIconProps) {
  const color = active ? "#a78bfa" : "#1e1b4b";
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.5 2H18.5L13 9H20.5L8.5 22L11 12.5H4L9.5 2Z"
        fill={color}
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
