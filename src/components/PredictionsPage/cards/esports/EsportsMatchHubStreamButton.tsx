"use client";

import { StreamActiveIcon } from "@/components/icons/feature/esports/streamActiveIcon";
import { StreamDisabledIcon } from "@/components/icons/feature/esports/streamDisabledIcon";

interface EsportsMatchHubStreamButtonProps {
  streamUrl?: string;
}

export function EsportsMatchHubStreamButton({ streamUrl }: EsportsMatchHubStreamButtonProps) {
  if (streamUrl) {
    return (
      <a
        href={streamUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-main-grayPurple transition-opacity hover:opacity-90"
        aria-label="Open stream"
      >
        <StreamActiveIcon />
      </a>
    );
  }

  return (
    <button
      type="button"
      disabled
      aria-label="Stream not available"
      className="flex h-8 w-8 shrink-0 cursor-not-allowed items-center justify-center rounded-lg bg-main-grayPurple opacity-50"
    >
      <StreamDisabledIcon />
    </button>
  );
}
