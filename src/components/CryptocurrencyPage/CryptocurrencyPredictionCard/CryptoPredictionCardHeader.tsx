"use client";

import Image from "next/image";

export interface CryptoPredictionCardHeaderProps {
  iconUrl: string;
  title: string;
  endLine: string;
}

export function CryptoPredictionCardHeader({ iconUrl, title, endLine }: CryptoPredictionCardHeaderProps) {
  return (
    <div className="flex gap-3">
      <div className="relative h-9 w-9 shrink-0">
        {iconUrl ? (
          <Image src={iconUrl} alt="" width={36} height={36} className="object-contain" />
        ) : (
          <span className="bg-main-grayPurple block h-9 w-9 rounded-lg" aria-hidden />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-main-darkPurple text-sm font-semibold leading-tight">{title}</h3>
      </div>
      <div className="max-w-[140px] shrink-0 text-right">
        <p className="text-main-darkPurple text-2xs font-medium leading-tight">{endLine}</p>
      </div>
    </div>
  );
}
