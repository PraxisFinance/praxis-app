"use client";

import { useState } from "react";
import { Balances } from "../Balances/Balances";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { ProfilePredictionCard } from "./ProfilePredictionCard";
import {
  PROFILE_PREDICTION_STATUS_FILTERS,
  PROFILE_PREDICTION_TIME_INTERVALS,
  PROFILE_PREDICTIONS_MOCK,
} from "@/shared/constants/profile";
import type {
  ProfilePredictionItem,
  ProfilePredictionStatusFilter,
  ProfilePredictionTimeInterval,
} from "@/shared/types/profile";

interface ProfilePredictionsSubPageProps {
  predictions?: ProfilePredictionItem[];
}

export function ProfilePredictionsSubPage({
  predictions = PROFILE_PREDICTIONS_MOCK,
}: ProfilePredictionsSubPageProps) {
  const [statusFilter, setStatusFilter] = useState<ProfilePredictionStatusFilter>("all");
  const [timeInterval, setTimeInterval] = useState<ProfilePredictionTimeInterval>("1D");

  const filtered = predictions.filter((item) => {
    if (statusFilter === "complete") return item.ended;
    if (statusFilter === "in_progress") return !item.ended;
    return true;
  });

  function handleClaim(id: string) {
    console.log("claim prediction", id);
  }

  return (
    <div className="flex flex-col gap-6">
      <Balances />

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <SectionHeader>Predictions</SectionHeader>

          <div className="flex items-center gap-2 shrink-0">
            <FilterDropdown
              options={PROFILE_PREDICTION_STATUS_FILTERS}
              value={statusFilter}
              onChange={setStatusFilter}
              minWidth="120px"
            />
            <FilterDropdown
              options={PROFILE_PREDICTION_TIME_INTERVALS}
              value={timeInterval}
              onChange={setTimeInterval}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <ProfilePredictionCard key={item.id} item={item} onClaim={handleClaim} />
            ))
          ) : (
            <p className="text-main-darkPurple/50 text-sm text-center py-6">
              No predictions found.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
