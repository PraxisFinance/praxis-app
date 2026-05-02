"use client";

import Image from "next/image";

export type RandomPoolIconVariant = "list" | "details";

export interface RandomPoolIconProps {
  iconUrl?: string;
  /** Used for image `alt` (e.g. pool title). */
  alt: string;
  variant: RandomPoolIconVariant;
}

export function RandomPoolIcon({ iconUrl, alt, variant }: RandomPoolIconProps) {
  if (variant === "list") {
    return (
      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-amber-100/80">
        {iconUrl ? (
          <Image
            src={iconUrl}
            alt={alt}
            width={36}
            height={36}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-lg">🪙</div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-main-lightGray ring-main-grayPurple/40 flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-sm ring-1 ring-inset">
      {iconUrl ? (
        <Image src={iconUrl} alt="" width={36} height={36} className="h-9 w-9 object-contain" />
      ) : (
        <div className="flex h-9 w-9 items-center justify-center text-xl leading-none">🪙</div>
      )}
    </div>
  );
}
