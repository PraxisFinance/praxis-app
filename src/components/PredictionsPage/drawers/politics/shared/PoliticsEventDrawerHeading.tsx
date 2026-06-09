"use client";

import Image from "next/image";
import { Drawer } from "vaul";

interface PoliticsEventDrawerHeadingProps {
  thumbnailUrl: string;
}

export function PoliticsEventDrawerHeading({ thumbnailUrl }: PoliticsEventDrawerHeadingProps) {
  const trimmedThumb = thumbnailUrl.trim();

  return (
    <div className="flex items-center justify-between gap-3">
      <Drawer.Title className="text-main-darkPurple ui-heading-2 font-semibold">
        Make a prediction
      </Drawer.Title>
      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-[5px] bg-main-grayPurple">
        {trimmedThumb ? (
          <Image src={trimmedThumb} alt="" fill className="object-cover" sizes="36px" />
        ) : (
          <span className="bg-main-grayPurple/80 block h-full w-full" aria-hidden />
        )}
      </div>
    </div>
  );
}
