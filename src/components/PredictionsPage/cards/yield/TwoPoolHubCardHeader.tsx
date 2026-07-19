"use client";

import { EndTimeBadge } from "../shared/EndTimeBadge";
import { TwoPoolHubCardIcon } from "./TwoPoolHubCardIcon";

export interface TwoPoolHubCardHeaderProps {
  title: string;
  protocolLabel: string;
  endLine: string;
}

export function TwoPoolHubCardHeader({
  title,
  protocolLabel,
  endLine,
}: TwoPoolHubCardHeaderProps) {
  return (
    <div className="flex items-start gap-3">
      <TwoPoolHubCardIcon />

      <div className="min-w-0 flex-1 pt-0.5">
        <h3 className="text-main-darkPurple text-sm leading-snug font-semibold">{title}</h3>
        <p className="text-main-darkPurple/55 text-2xs leading-tight underline underline-offset-2">
          Protocol: {protocolLabel}
        </p>
      </div>

      <EndTimeBadge endLine={endLine} />
    </div>
  );
}
