"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowIcon } from "@/components/ui/icons/ArrowIcon";

interface OnDevelopmentPageProps {
  onBack?: () => void;
  onMainMenu?: () => void;
}

export function OnDevelopmentPage({ onBack, onMainMenu }: OnDevelopmentPageProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-2.5">
        <Button variant="pillPrimary" size="pill" onClick={onBack}>
          <ArrowIcon className="w-4 h-4 rotate-180" />
          Back
        </Button>

        <Button variant="pillSecondary" size="pill" onClick={onMainMenu}>
          Main menu
        </Button>
      </div>

      <div className="flex flex-col items-center gap-6 pt-4">
        <h1 className="text-main-darkPurple text-3xl font-bold leading-tight">Sorry!</h1>

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
