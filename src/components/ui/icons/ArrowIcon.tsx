interface ArrowIconProps {
  className?: string;
}

export function ArrowIcon({ className = "w-4 h-4" }: ArrowIconProps) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 16 16" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M3.33 8H12.67M12.67 8L8.67 4M12.67 8L8.67 12" 
        stroke="white" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}
