"use client";

function formatPercentLabel(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return `${rounded}%`;
}

export interface TwoPoolExpectedPerformanceTableProps {
  realApyPercents: readonly number[];
  receivePercents: readonly number[];
}

export function TwoPoolExpectedPerformanceTable({
  realApyPercents,
  receivePercents,
}: TwoPoolExpectedPerformanceTableProps) {
  const columnCount = Math.min(realApyPercents.length, receivePercents.length);

  return (
    <div className="bg-main-white rounded-[8px] px-3 py-2.5">
      <div className="flex items-stretch gap-2 text-xs leading-tight">
        <div className="text-main-darkPurple/70 flex shrink-0 flex-col justify-between gap-1.5">
          <span>Real APY:</span>
          <span>Your receive:</span>
        </div>

        <div className="text-main-darkPurple flex min-w-0 flex-1 justify-between gap-1 font-medium tabular-nums">
          {Array.from({ length: columnCount }, (_, index) => (
            <div
              key={`perf-col-${index}`}
              className="flex min-w-0 flex-1 flex-col items-center justify-between gap-1.5 text-center"
            >
              <span>{formatPercentLabel(realApyPercents[index]!)}</span>
              <span>{formatPercentLabel(receivePercents[index]!)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
