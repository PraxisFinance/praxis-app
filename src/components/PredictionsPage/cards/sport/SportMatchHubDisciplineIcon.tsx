"use client";

import type { ComponentType } from "react";
import type { PredictionsHubSportDisciplineId } from "@/shared/constants/predictionsHubFilters";
import { BasketballIcon } from "@/components/icons/feature/predictions/BasketballIcon";
import { FootballIcon } from "@/components/icons/feature/predictions/FootballIcon";
import { Formula1Icon } from "@/components/icons/feature/predictions/Formula1Icon";
import { HockeyIcon } from "@/components/icons/feature/predictions/HockeyIcon";

const SPORT_DISCIPLINE_ICONS: Record<
  PredictionsHubSportDisciplineId,
  ComponentType<{ className?: string }>
> = {
  football: FootballIcon,
  basketball: BasketballIcon,
  hockey: HockeyIcon,
  formula1: Formula1Icon,
};

interface SportMatchHubDisciplineIconProps {
  disciplineId: PredictionsHubSportDisciplineId;
}

export function SportMatchHubDisciplineIcon({ disciplineId }: SportMatchHubDisciplineIconProps) {
  const Icon = SPORT_DISCIPLINE_ICONS[disciplineId];

  return (
    <div
      className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
      aria-hidden
    >
      <Icon className="size-[15px]" />
    </div>
  );
}
