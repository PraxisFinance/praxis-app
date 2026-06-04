"use client";

import Image from "next/image";
import { EndTimeBadge } from "../shared/EndTimeBadge";

export interface FinanceEventHubCardHeaderProps {
  logoUrl: string;
  title: string;
  endLine: string;
  volumeLabel?: string;
}

export function FinanceEventHubCardHeader({
  logoUrl,
  title,
  endLine,
  volumeLabel,
}: FinanceEventHubCardHeaderProps) {
  const trimmedLogo = logoUrl.trim();

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-start gap-3">
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-[5px] bg-main-grayPurple">
          {trimmedLogo ? (
            <Image src={trimmedLogo} alt="" fill className="object-contain p-0.5" sizes="36px" />
          ) : (
            <span className="bg-main-grayPurple/80 block h-full w-full" aria-hidden />
          )}
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <h3 className="text-main-darkPurple text-sm leading-snug font-semibold">{title}</h3>
        </div>

        <EndTimeBadge endLine={endLine} />
      </div>

      {volumeLabel ? (
        <div className="flex justify-end">
          <span className="text-main-darkPurple/55 text-2xs leading-tight tabular-nums">
            {volumeLabel}
          </span>
        </div>
      ) : null}
    </div>
  );
}
