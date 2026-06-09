"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

export type PredictionsDrawerHeaderImageFit = "cover" | "contain";

interface PredictionsDrawerHeaderImageProps {
  imageUrl: string;
  imageFit?: PredictionsDrawerHeaderImageFit;
}

export function PredictionsDrawerHeaderImage({
  imageUrl,
  imageFit = "cover",
}: PredictionsDrawerHeaderImageProps) {
  const trimmedImage = imageUrl.trim();

  return (
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
  );
}
