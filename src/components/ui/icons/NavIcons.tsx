interface IconProps {
  className?: string;
  active?: boolean;
}

export function HomeIcon({ className = "w-6 h-6", active = false }: IconProps) {
  const color = active ? "#a78bfa" : "#1e1b4b";
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M3 9.5L12 3L21 9.5V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9.5Z" 
        fill={color}
      />
      <path d="M9 22V12H15V22" stroke={active ? "#a78bfa" : "#1e1b4b"} strokeWidth="2"/>
    </svg>
  );
}

export function EarnIcon({ className = "w-6 h-6", active = false }: IconProps) {
  const color = active ? "#a78bfa" : "#1e1b4b";
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="16" height="18" rx="2" fill={color} />
      <path d="M8 10H16M8 14H16M8 18H12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function PredictionsIcon({ className = "w-6 h-6", active = false }: IconProps) {
  const color = active ? "#a78bfa" : "#1e1b4b";
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3V21H21" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M7 14L11 10L15 14L21 8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function HistoryIcon({ className = "w-6 h-6", active = false }: IconProps) {
  const color = active ? "#a78bfa" : "#1e1b4b";
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M12 7V12L15 15" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function ProfileIcon({ className = "w-6 h-6", active = false }: IconProps) {
  const color = active ? "#a78bfa" : "#1e1b4b";
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="4" fill={color}/>
      <path d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function SettingsIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="3" stroke="#a78bfa" strokeWidth="2"/>
      <path d="M12 2V6M12 18V22M22 12H18M6 12H2M19.07 4.93L16.24 7.76M7.76 16.24L4.93 19.07M19.07 19.07L16.24 16.24M7.76 7.76L4.93 4.93" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function NotificationIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" fill="#a78bfa"/>
      <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
