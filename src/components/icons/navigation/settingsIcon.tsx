import type { HeaderChromeIconProps } from "./navIconProps";

export function SettingsIcon({ className = "w-4 h-4" }: HeaderChromeIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="3" stroke="#a78bfa" strokeWidth="2" />
      <path
        d="M12 2V6M12 18V22M22 12H18M6 12H2M19.07 4.93L16.24 7.76M7.76 16.24L4.93 19.07M19.07 19.07L16.24 16.24M7.76 7.76L4.93 4.93"
        stroke="#a78bfa"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
