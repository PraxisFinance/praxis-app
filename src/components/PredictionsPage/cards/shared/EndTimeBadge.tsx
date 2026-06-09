import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

export function EndTimeBadge({ endLine }: { endLine: string }) {
  const colonIdx = endLine.indexOf(": ");
  const label = colonIdx >= 0 ? endLine.slice(0, colonIdx) : endLine;
  const value = colonIdx >= 0 ? endLine.slice(colonIdx + 2) : null;

  return (
    <div
      className={cn(
        "inline-flex max-w-[min(100%,180px)] shrink-0 items-center gap-1 rounded-[6px]",
        "bg-main-grayPurple/70 px-1.5 py-1 whitespace-normal"
      )}
    >
      <Clock className="text-main-darkPurple/65 size-3 shrink-0" strokeWidth={2.25} aria-hidden />
      {value != null ? (
        <>
          <span className="text-main-darkPurple text-2xs leading-tight">{label}:</span>
          <span className="text-main-darkPurple text-2xs leading-tight tabular-nums">{value}</span>
        </>
      ) : (
        <span className="text-main-darkPurple text-2xs leading-tight">{endLine}</span>
      )}
    </div>
  );
}
