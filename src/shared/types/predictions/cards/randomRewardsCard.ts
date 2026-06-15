import type { PredictionCoreListItem } from "../core/listItemCore";
import type { PredictionStatus } from "../core/status";

export type RandomPoolRemainingTime = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type PredictionRandomRewardsCardBase = PredictionCoreListItem & {
  predictionType: "random_reward";
  title: string;
  iconUrl?: string;
};

export type PredictionRandomRewardsLiveCard = PredictionRandomRewardsCardBase & {
  status: Extract<PredictionStatus, { kind: "live" }>;
  tvl: string;
  expectedYield: string;
  usersIn: number;
  progressPercent: number;
  remainingTime: RandomPoolRemainingTime;
};

export type PredictionRandomRewardsEndedCard = PredictionRandomRewardsCardBase & {
  status: Extract<PredictionStatus, { kind: "ended" }>;
  tvl: string;
  earnings: string;
  usersWon: number;
  usersInPool?: number;
  progressPercent: number;
  userWon: boolean;
};

export type PredictionRandomRewardsCard =
  | PredictionRandomRewardsLiveCard
  | PredictionRandomRewardsEndedCard;

/** @deprecated Use `PredictionRandomRewardsLiveCard`. */
export type RandomPoolLive = PredictionRandomRewardsLiveCard;

/** @deprecated Use `PredictionRandomRewardsEndedCard`. */
export type RandomPoolEnded = PredictionRandomRewardsEndedCard;

/** @deprecated Use `PredictionRandomRewardsCard`. */
export type RandomPool = PredictionRandomRewardsCard;
