import type { BottomNavIconProps } from "./navIconProps";

export function ProgressIcon({ className = "w-6 h-6", active = false }: BottomNavIconProps) {
  const color = active ? "#a78bfa" : "#1e1b4b";
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
      <path
        d="M5.25 17.25V12.75H8.25V17.25H5.25Z"
        fill={color}
      />
      <path
        d="M10.125 17.25V9.75H13.125V17.25H10.125Z"
        fill={color}
      />
      <path
        d="M14.875 17.25V6.75H17.875V17.25H14.875Z"
        fill={color}
      />
      <path
        d="M19.625 17.25V3.75H22.625V17.25H19.625Z"
        fill={color}
      />
      <path
        d="M2.25 18.75H21.75V20.25H2.25V18.75Z"
        fill={color}
      />
    </svg>
  );
}
