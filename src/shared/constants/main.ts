import type { MenuItem } from "@/shared/types/main";
import {
  EARN_ROUTE,
  HOW_IT_WORKS_ROUTE,
  INVITE_FRIENDS_ROUTE,
  PREDICTIONS_ROUTE,
} from "@/lib/routes";

/** @deprecated Prefer `MENU_ITEMS_V2`. Kept for easy rollback of MainPage. */
export const MENU_ITEMS: MenuItem[] = [
  {
    key: "smart-predictions",
    type: "large",
    title: "Smart predictions",
    description: "Earning mechanism that combines yield and prediction market mechanics.",
    backgroundImage: "/main/smart-predictions.png",
    redirectUrl: HOW_IT_WORKS_ROUTE,
    redirectLabel: "How it works",
  },
  {
    key: "yield",
    type: "middle",
    backgroundImage: "/main/yield.png",
    redirectUrl: EARN_ROUTE,
    redirectLabel: "Yield",
  },
  {
    key: "random-distribution",
    type: "middle",
    backgroundImage: "/main/random-distribution.png",
    hubCategoryId: "random-rewards",
    redirectLabel: "Random distribution",
  },
  {
    key: "financial-predictions",
    type: "middle",
    backgroundImage: "/main/financial-predictions.png",
    hubCategoryId: "finance",
    redirectLabel: "Financial predictions",
  },
  {
    key: "e-sports-predictions",
    type: "middle",
    backgroundImage: "/main/e-sports-predictions.png",
    hubCategoryId: "esports",
    redirectLabel: "E-sport predictions",
  },
  {
    key: "invite-friends",
    type: "middle",
    backgroundImage: "/main/invite-friends.png",
    redirectUrl: INVITE_FRIENDS_ROUTE,
    redirectLabel: "Invite friends",
  },
  {
    key: "progress",
    type: "middle",
    backgroundImage: "/main/leaderboard.png",
    progressHubCategoryId: "achievements",
    redirectLabel: "Play & Boost",
  },
];

/** MainPage application menu — V2 layout (2×2 grid + featured card). */
export const MENU_ITEMS_V2: MenuItem[] = [
  {
    key: "smart-predictions",
    type: "large",
    title: "Smart predictions",
    description: "Earning mechanism that combines yield and prediction market mechanics.",
    backgroundImage: "/main/HowItWorks.png",
    redirectUrl: HOW_IT_WORKS_ROUTE,
    redirectLabel: "How it works",
  },
  {
    key: "yield",
    type: "middle",
    backgroundImage: "/main/MainYield.png",
    redirectUrl: EARN_ROUTE,
    redirectLabel: "Yield",
  },
  {
    key: "predictions",
    type: "middle",
    backgroundImage: "/main/Prediction.png",
    redirectUrl: PREDICTIONS_ROUTE,
    redirectLabel: "Predictions",
  },
  {
    key: "referral-program",
    type: "middle",
    backgroundImage: "/main/Friends.png",
    redirectUrl: INVITE_FRIENDS_ROUTE,
    redirectLabel: "Referral program",
  },
  {
    key: "play-boost",
    type: "middle",
    backgroundImage: "/main/Boost.png",
    progressHubCategoryId: "achievements",
    redirectLabel: "Play & Boost",
  },
];
