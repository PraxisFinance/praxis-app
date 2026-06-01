"use client";

import {
  PREDICTIONS_HUB_CATEGORY_FILTERS,
  PREDICTIONS_HUB_ESPORTS_GAMES,
  PREDICTIONS_HUB_MARKET_TYPE_FILTERS,
  PREDICTIONS_HUB_SPORT_DISCIPLINES,
  PREDICTIONS_HUB_TIME_FILTERS,
  applyPredictionsHubCategoryChange,
  getPredictionsHubSubFilterKind,
  type PredictionsHubFilterState,
} from "@/shared/constants/predictionsHubFilters";
import { EsportsGameFilterRow } from "./EsportsGameFilterRow";
import { FilterChipRow } from "./FilterChipRow";
import { OptionalFilterChipRow } from "./OptionalFilterChipRow";

export interface PredictionsHubFilterProps {
  value: PredictionsHubFilterState;
  onChange: (value: PredictionsHubFilterState) => void;
}

export function PredictionsHubFilter({ value, onChange }: PredictionsHubFilterProps) {
  const subFilterKind = getPredictionsHubSubFilterKind(value.categoryId);

  return (
    <section className="flex flex-col gap-4">
      <FilterChipRow
        options={PREDICTIONS_HUB_CATEGORY_FILTERS}
        value={value.categoryId}
        onChange={(categoryId) => onChange(applyPredictionsHubCategoryChange(value, categoryId))}
        ariaLabel="Prediction categories"
      />

      <FilterChipRow
        options={PREDICTIONS_HUB_TIME_FILTERS}
        value={value.timeId}
        onChange={(timeId) => onChange({ ...value, timeId })}
        ariaLabel="Event end time"
      />

      {subFilterKind === "market-type" ? (
        <FilterChipRow
          options={PREDICTIONS_HUB_MARKET_TYPE_FILTERS}
          value={value.marketTypeId}
          onChange={(marketTypeId) => onChange({ ...value, marketTypeId })}
          ariaLabel="Crypto and finance market types"
        />
      ) : null}

      {subFilterKind === "esports-game" ? (
        <EsportsGameFilterRow
          games={PREDICTIONS_HUB_ESPORTS_GAMES}
          value={value.esportsGameId}
          onChange={(esportsGameId) => onChange({ ...value, esportsGameId })}
        />
      ) : null}

      {subFilterKind === "sport-discipline" ? (
        <OptionalFilterChipRow
          options={PREDICTIONS_HUB_SPORT_DISCIPLINES}
          value={value.sportDisciplineId}
          onChange={(sportDisciplineId) => onChange({ ...value, sportDisciplineId })}
          ariaLabel="Sport disciplines"
        />
      ) : null}
    </section>
  );
}
