interface RandomPoolStatCardProps {
  label: string;
  value: string;
}

export function RandomPoolStatCard({ label, value }: RandomPoolStatCardProps) {
  return (
    <div className="bg-main-grayPurple/75 flex w-fit shrink-0 flex-col items-start justify-start gap-0.5 rounded-sm px-2 py-1 text-left">
      <span className="text-main-darkPurple text-2xs w-full text-left leading-tight font-medium">
        {label}
      </span>
      <span className="text-main-darkPurple text-xs w-full text-left leading-tight tabular-nums">
        {value}
      </span>
    </div>
  );
}
