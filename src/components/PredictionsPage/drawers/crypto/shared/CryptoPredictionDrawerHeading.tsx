"use client";

import { Drawer } from "vaul";
import { CryptoPredictionDrawerIcon } from "./CryptoPredictionDrawerIcon";

interface CryptoPredictionDrawerHeadingProps {
  iconUrl: string;
}

export function CryptoPredictionDrawerHeading({ iconUrl }: CryptoPredictionDrawerHeadingProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Drawer.Title className="text-main-darkPurple ui-heading-2 font-semibold">
        Make a prediction
      </Drawer.Title>
      <CryptoPredictionDrawerIcon iconUrl={iconUrl} />
    </div>
  );
}
