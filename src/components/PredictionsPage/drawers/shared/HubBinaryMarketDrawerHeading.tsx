"use client";

import Image from "next/image";
import { Drawer } from "vaul";
import { cn } from "@/lib/utils";

export type HubBinaryMarketDrawerHeadingImageFit = "cover" | "contain";

interface HubBinaryMarketDrawerHeadingProps {
  imageUrl: string;
  imageFit?: HubBinaryMarketDrawerHeadingImageFit;
}

export function HubBinaryMarketDrawerHeading({
  imageUrl,
  imageFit = "cover",
}: HubBinaryMarketDrawerHeadingProps) {
  const trimmedImage = imageUrl.trim();

  return (
    <div className="flex items-center justify-between gap-3">
      <Drawer.Title className="text-main-darkPurple ui-heading-2 font-semibold">
        Make a prediction
      </Drawer.Title>
      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-[5px] bg-main-grayPurple">
        {trimmedImage ? (
          <Image
            src={trimmedImage}
            alt=""
            fill
            className={cn(imageFit === "contain" ? "object-contain p-0.5" : "object-cover")}
            sizes="36px"
          />
        ) : (
          <span className="bg-main-grayPurple/80 block h-full w-full" aria-hidden />
        )}
      </div>
    </div>
  );
}
