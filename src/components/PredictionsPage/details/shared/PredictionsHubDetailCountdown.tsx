"use client";

import { usePredictionCountdown } from "./usePredictionCountdown";

interface CountdownUnitProps {
  value: number;
  label: string;
}

function CountdownUnit({ value, label }: CountdownUnitProps) {
  return (
    <div className="bg-main-lightGray flex min-w-[44px] flex-col items-center rounded-[5px] px-2 py-1.5">
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
  const { days, hours, minutes, seconds } = usePredictionCountdown(endsAt);

  const units =
    days > 0
      ? [
          { value: days, label: "Days" },
          { value: hours, label: "Hrs" },
          { value: minutes, label: "Mins" },
        ]
      : hours > 0
        ? [
            { value: hours, label: "Hrs" },
            { value: minutes, label: "Mins" },
            { value: seconds, label: "Secs" },
          ]
        : [
            { value: minutes, label: "Mins" },
            { value: seconds, label: "Secs" },
          ];

  return (
    <div className="flex shrink-0 items-center gap-1.5" aria-live="polite" aria-atomic="true">
      {units.map((unit) => (
        <CountdownUnit key={unit.label} value={unit.value} label={unit.label} />
      ))}
    </div>
  );
}
