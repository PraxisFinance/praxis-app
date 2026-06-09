import type { MenuItem } from "@/shared/types/main";
import {
  EARN_ROUTE,
  PREDICTIONS_CRYPTOCURRENCY_ROUTE,
  PREDICTIONS_ESPORTS_ROUTE,
  PREDICTIONS_RANDOM_REWARDS_ROUTE,
} from "@/lib/routes";
import { INVITE_FRIENDS_ROUTE } from "@/shared/constants/inviteFriends";
import { LEADERBOARD_ROUTE } from "@/shared/constants/leaderboard";
import { HOW_IT_WORKS_ROUTE } from "@/shared/constants/howItWorks";

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
    // redirectUrl: PREDICTIONS_RANDOM_REWARDS_ROUTE,
  },
  {
    key: "financial-predictions",
    type: "middle",
    backgroundImage: "/main/financial-predictions.png",
    hubCategoryId: "finance",
    redirectLabel: "Financial predictions",
    // redirectUrl: PREDICTIONS_CRYPTOCURRENCY_ROUTE,
  },
  {
    key: "e-sports-predictions",
    type: "middle",
    backgroundImage: "/main/e-sports-predictions.png",
    hubCategoryId: "esports",
    redirectLabel: "E-sport predictions",
    // redirectUrl: PREDICTIONS_ESPORTS_ROUTE,
  },
  {
    key: "invite-friends",
    type: "middle",
    backgroundImage: "/main/invite-friends.png",
    redirectUrl: INVITE_FRIENDS_ROUTE,
    redirectLabel: "Invite friends",
  },
  {
    key: "leaderboard",
    type: "middle",
    backgroundImage: "/main/leaderboard.png",
    redirectUrl: LEADERBOARD_ROUTE,
    redirectLabel: "Leaderboard",
  },
];
