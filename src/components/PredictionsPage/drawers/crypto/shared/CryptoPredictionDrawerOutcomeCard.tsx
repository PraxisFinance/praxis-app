"use client";

interface CryptoPredictionDrawerOutcomeCardProps {
  primaryLine: string;
  secondaryLine: string;
  poolPercent?: number;
}

export function CryptoPredictionDrawerOutcomeCard({
  primaryLine,
  secondaryLine,
  poolPercent,
}: CryptoPredictionDrawerOutcomeCardProps) {
  return (
    <div className="bg-main-grayPurple/80 flex flex-col gap-2 rounded-[10px] px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <p className="text-main-darkPurple min-w-0 text-sm leading-snug font-semibold">{primaryLine}</p>
        {poolPercent != null ? (
          <span className="text-main-darkPurple shrink-0 text-sm font-semibold tabular-nums">
            {poolPercent}%
          </span>
        ) : null}
      </div>
      <p className="text-main-darkPurple/65 text-xs leading-snug font-normal">{secondaryLine}</p>
    </div>
  );
}
