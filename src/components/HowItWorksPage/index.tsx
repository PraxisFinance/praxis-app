"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ArrowIcon } from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  HOW_IT_WORKS_ABOUT_INTRO,
  HOW_IT_WORKS_GUIDE_STEPS,
  HOW_IT_WORKS_NUMBERED_POINTS,
  HOW_IT_WORKS_TWITTER_URL,
} from "@/shared/constants/howItWorks";
import { XLogo } from "@/components/icons/brand/xLogo";
import { CupIcon } from "@/components/icons/feature/how-it-works/cupIcon";
import { DollarIcon } from "@/components/icons/feature/how-it-works/dollarIcon";
import { LevelingIcon } from "@/components/icons/feature/how-it-works/levelingIcon";
import { LightningIcon } from "@/components/icons/feature/how-it-works/lightningIcon";

type GuideStepId = (typeof HOW_IT_WORKS_GUIDE_STEPS)[number]["id"];

function GuideStepIcon({ id }: { id: GuideStepId }) {
  switch (id) {
    case "deposit":
      return <DollarIcon />;
    case "yield":
      return <LightningIcon />;
    case "predict":
      return <LevelingIcon />;
    case "boost":
      return <LightningIcon />;
    case "strategy":
      return <CupIcon />;
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}

export function HowItWorksPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-full flex-col gap-6 pb-8">
      <div className="flex flex-row flex-wrap items-center gap-2.5">
        <Button variant="pillPrimary" size="pill" onClick={() => router.back()}>
          <ArrowIcon className="h-4 w-4 rotate-180" />
          Back
        </Button>

        <Button variant="pillSecondary" size="pill" onClick={() => router.push("/main")}>
          Main menu
        </Button>
      </div>

      <section className="flex flex-col gap-3">
        <SectionHeader className="text-main-darkPurple">Guide: How to use app</SectionHeader>
        <ul className="flex flex-col gap-1.5">
          {HOW_IT_WORKS_GUIDE_STEPS.map((step) => {
            return (
              <li key={step.id} className="flex flex-row items-stretch gap-3">
                <div
                  className={cn(
                    "bg-main-purple text-white flex size-11 shrink-0 items-center justify-center rounded-lg",
                    "self-center sm:self-stretch sm:min-h-[3rem]"
                  )}
                  aria-hidden
                >
                  <span className="inline-flex h-5 w-5 items-center justify-center overflow-visible">
                    <GuideStepIcon id={step.id} />
                  </span>
                </div>
                <div className="bg-main-lightGray text-main-darkPurple flex min-w-0 flex-1 items-center justify-center rounded-lg px-3 py-2.5 text-center text-sm leading-snug sm:px-4 sm:text-base sm:leading-normal">
                  {step.text}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-main-darkPurple text-xl font-medium leading-tight sm:text-2xl">
          More about Praxis
        </h2>

        <div className="flex flex-col gap-2">
          <h3 className="text-main-darkPurple text-base leading-snug">About application</h3>
          <p className="text-main-darkPurple text-sm leading-relaxed sm:text-base">
            {HOW_IT_WORKS_ABOUT_INTRO}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-main-darkPurple text-base leading-snug">How it works?</h3>
          <ol className="text-main-darkPurple list-decimal space-y-2 pl-5 text-sm leading-relaxed sm:text-base">
            {HOW_IT_WORKS_NUMBERED_POINTS.map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ol>
        </div>
      </section>

      <a
        href={HOW_IT_WORKS_TWITTER_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-main-purple text-white hover:bg-main-purple/90 focus-visible:ring-ring/50 inline-flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium transition-colors focus-visible:ring-3 focus-visible:outline-none"
      >
        <XLogo className="size-5 shrink-0" />
        Praxis twitter
      </a>
    </div>
  );
}
