interface AlertIconProps {
  className?: string;
}

export function AlertIcon({ className = "w-4 h-4" }: AlertIconProps) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="13" height="13" rx="6.5" fill="#C8C8C8" />
      <path
        d="M6.97665 8.98223H6.34572L6.17585 4.97823V2.6001H7.19505V4.97823L6.97665 8.98223ZM7.29212 11.239H6.06665V10.0257H7.29212V11.239Z"
        fill="#F6F4FC"
      />
    </svg>
  );
}
