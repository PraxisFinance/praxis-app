import type { MenuItem } from "@/shared/types/main";

export const MENU_ITEMS: MenuItem[] = [
  {
    key: "smart-predictions",
    type: "large",
    title: "Smart predictions",
    description: "Earning mechanism that combines yield and prediction market mechanics.",
    backgroundImage: "/main/smart-predictions.png",
    redirectUrl: "/predictions/cryptocurrency",
    redirectLabel: "How it works",
  },
  {
    key: "yield",
    type: "middle",
    backgroundImage: "/main/yield.png",
    redirectUrl: "/earn",
    redirectLabel: "Yield",
  },
  {
    key: "random-distribution",
    type: "middle",
    backgroundImage: "/main/random-distribution.png",
    redirectUrl: "/predictions/random-rewards",
    redirectLabel: "Random distribution",
  },
  {
    key: "financial-predictions",
    type: "middle",
    backgroundImage: "/main/financial-predictions.png",
    redirectUrl: "/predictions/all",
    redirectLabel: "Financial predictions",
  },
  {
    key: "e-sports-predictions",
    type: "middle",
    backgroundImage: "/main/e-sports-predictions.png",
    redirectUrl: "/predictions/esports",
    redirectLabel: "E-sport predictions",
  },
  {
    key: "invite-friends",
    type: "middle",
    backgroundImage: "/main/invite-friends.png",
    redirectUrl: "/profile",
    redirectLabel: "Invite friends",
  },
  {
    key: "leaderboard",
    type: "middle",
    backgroundImage: "/main/leaderboard.png",
    redirectUrl: "/profile/predictions",
    redirectLabel: "Leaderboard",
  },
];
