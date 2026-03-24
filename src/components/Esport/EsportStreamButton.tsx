"use client";

import Image from "next/image";

const STREAM_LINK_ICON = "/icons/online-link.png";

function StreamIcon() {
  return (
    <Image
      src={STREAM_LINK_ICON}
      alt=""
      width={20}
      height={20}
      className="object-contain"
    />
  );
}

interface EsportStreamButtonProps {
  streamUrl?: string;
}

export function EsportStreamButton({ streamUrl }: EsportStreamButtonProps) {
  if (streamUrl) {
    return (
      <a
        href={streamUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-main-grayPurple transition-opacity hover:opacity-90"
        aria-label="Open stream"
      >
        <StreamIcon />
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
      <StreamIcon />
    </button>
  );
}
