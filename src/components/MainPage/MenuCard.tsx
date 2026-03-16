import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "@/components/ui/icons/ArrowIcon";

interface MenuCardProps {
  title?: string;
  description?: string;
  backgroundImage?: string;
  redirectUrl?: string;
  redirectLabel?: string;
}

export function MenuCard({ title, description, backgroundImage, redirectUrl, redirectLabel }: MenuCardProps) {
  return (
    <Link
      href={redirectUrl ?? ""}
      className="relative w-full h-28 bg-slate-200 rounded-[5px] overflow-hidden flex flex-col justify-between p-2.5 transition-transform active:scale-[0.98]"
    >
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt={title ?? ""}
          fill
          className="object-cover"
        />
      )}

      <div className="relative z-10 flex flex-col gap-1">
        {title && (
          <span className="text-indigo-950 text-sm font-medium leading-4">{title}</span>
        )}
        {description && (
          <span className="text-indigo-950 text-2xs font-normal leading-3">
            {description}
          </span>
        )}
      </div>

      {redirectLabel && (
        <div className="relative z-10 self-start px-2.5 py-[5px] bg-main-purple rounded-[30px] inline-flex items-center gap-[5px]">
          <span className="text-white text-2xs font-medium leading-3">{redirectLabel}</span>
          <ArrowIcon className="w-4 h-4" />
        </div>
      )}
    </Link>
  );
}
