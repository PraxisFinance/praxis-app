"use client";

import { useRouter } from "next/navigation";
import type { KeyboardEvent, MouseEvent, ReactNode } from "react";
import { buildPredictionsHubDetailRoute } from "@/lib/routes";
import type { TwoPool } from "@/shared/types/twoPool";

const INTERACTIVE_SELECTOR = 'button, a, [role="button"], [data-slot="button"]';

function isInteractiveTarget(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && Boolean(target.closest(INTERACTIVE_SELECTOR));
}

export interface TwoPoolHubCardLinkProps {
  pool: TwoPool;
  children: ReactNode;
}

/** Wraps a TwoPool hub card so the card opens its detail route; buttons keep their own behavior. */
export function TwoPoolHubCardLink({ pool, children }: TwoPoolHubCardLinkProps) {
  const router = useRouter();
  const href = buildPredictionsHubDetailRoute(pool.id);

  const navigate = () => router.push(href);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (isInteractiveTarget(event.target)) return;
    navigate();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    if (isInteractiveTarget(event.target)) return;
    event.preventDefault();
    navigate();
  };

  return (
    <div
      role="link"
      tabIndex={0}
      className="w-full cursor-pointer rounded-[10px] transition-opacity hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-purple"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
}
