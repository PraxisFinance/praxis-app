"use client";

import Image from "next/image";
import { ArrowIcon } from "@/components/ui/icons/ArrowIcon";

interface OnDevelopmentPageProps {
  onBack?: () => void;
  onMainMenu?: () => void;
}

export function OnDevelopmentPage({ onBack, onMainMenu }: OnDevelopmentPageProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-2.5">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-4 py-2 bg-main-purple rounded-[30px] text-white text-sm font-medium leading-4"
        >
          <ArrowIcon className="w-4 h-4 rotate-180" />
          Back
        </button>

        <button
          onClick={onMainMenu}
          className="px-4 py-2 bg-main-lightGray rounded-[30px] text-main-darkPurple text-sm font-medium leading-4"
        >
          Main menu
        </button>
      </div>

      <div className="flex flex-col items-center gap-6 pt-4">
        <h1 className="text-main-darkPurple text-3xl font-bold leading-tight">
          Sorry!
        </h1>

        <div className="relative w-48 h-48">
          <Image
            src="/on-development.png"
            alt="Under development"
            fill
            className="object-contain"
          />
        </div>

        <p className="text-main-darkPurple text-base font-normal text-center leading-6 max-w-[260px]">
          This page is under development now. You will be able to use the new functionality soon.
        </p>
      </div>
    </div>
  );
}
