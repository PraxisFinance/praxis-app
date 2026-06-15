export type {
  PredictionRandomRewardsCard,
  PredictionRandomRewardsEndedCard,
  PredictionRandomRewardsLiveCard,
  RandomPool,
  RandomPoolEnded,
  RandomPoolLive,
  RandomPoolRemainingTime,
} from "../cards/randomRewardsCard";

export type RandomRewardsPredictionCard = import("../cards/randomRewardsCard").PredictionRandomRewardsCard;

export type RandomPoolUserInPool = {
  username: string;
  amount: string;
  avatarUrl?: string;
  currencyIconUrl?: string;
};

export type RandomRewardsPredictionDetail = {
  id?: string;
  participants?: RandomPoolUserInPool[];
  winners?: RandomPoolUserInPool[];
  walletBalance?: string;
};

/** @deprecated Use `RandomRewardsPredictionDetail`. */
export type RandomPoolHubDetail = Omit<RandomRewardsPredictionDetail, "id">;
