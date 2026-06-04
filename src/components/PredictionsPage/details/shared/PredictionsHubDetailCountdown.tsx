"use client";

import { usePredictionCountdown } from "./usePredictionCountdown";

interface CountdownUnitProps {
  value: number;
  label: string;
}

function CountdownUnit({ value, label }: CountdownUnitProps) {
  return (
    <div className="bg-main-lightGray flex min-w-[52px] flex-col items-center rounded-[5px] px-2.5 py-1.5">
      <span className="text-main-darkPurple text-lg leading-none font-semibold tabular-nums">
        {value}
      </span>
      <span className="text-main-darkPurple/55 text-2xs mt-0.5 leading-tight">{label}</span>
    </div>
  );
}

export interface PredictionsHubDetailCountdownProps {
  endsAt: string;
}

export function PredictionsHubDetailCountdown({ endsAt }: PredictionsHubDetailCountdownProps) {
  const { minutes, seconds } = usePredictionCountdown(endsAt);

  return (
    <div className="flex shrink-0 items-center gap-2" aria-live="polite" aria-atomic="true">
      <CountdownUnit value={minutes} label="Mins" />
      <CountdownUnit value={seconds} label="Secs" />
    </div>
  );
}
