"use client";

import Image from "next/image";

interface TechEventDetailTitleCardProps {
  thumbnailUrl: string;
  title: string;
}

export function TechEventDetailTitleCard({ thumbnailUrl, title }: TechEventDetailTitleCardProps) {
  const trimmedThumb = thumbnailUrl.trim();

  return (
    <section className="bg-main-lightGray flex items-start gap-3 rounded-[10px] p-3">
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[5px] bg-main-grayPurple">
        {trimmedThumb ? (
          <Image src={trimmedThumb} alt="" fill className="object-cover" sizes="48px" />
        ) : (
          <span className="bg-main-grayPurple/80 block h-full w-full" aria-hidden />
        )}
      </div>
      <h1 className="text-main-darkPurple min-w-0 flex-1 pt-0.5 text-base leading-snug font-semibold">
        {title}
      </h1>
    </section>
  );
}
