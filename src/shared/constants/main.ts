import type { MenuItem } from "@/shared/types/main";

export const MENU_ITEMS: MenuItem[] = [
  {
    key: "smart-predictions",
    type: "large",
    title: "Smart predictions",
    description: "Earning mechanism that combines yield and prediction market mechanics.",
    backgroundImage: "/main/smart-predictions.png",
    redirectUrl: "",
    redirectLabel: "How it works",
  },
  {
    key: "yield",
    type: "middle",
    backgroundImage: "/main/yield.png",
    redirectUrl: "",
    redirectLabel: "Yield",
  },
  {
    key: "random-distribution",
    type: "middle",
    backgroundImage: "/main/random-distribution.png",
    redirectUrl: "",
    redirectLabel: "Random distribution",
  },
  {
    key: "financial-predictions",
    type: "middle",
    backgroundImage: "/main/financial-predictions.png",
    redirectUrl: "",
    redirectLabel: "Financial predictions",
  },
  {
    key: "e-sports-predictions",
    type: "middle",
    backgroundImage: "/main/e-sports-predictions.png",
    redirectUrl: "",
    redirectLabel: "E-sport predictions",
  },
  {
    key: "invite-friends",
    type: "middle",
    backgroundImage: "/main/invite-friends.png",
    redirectUrl: "",
    redirectLabel: "Invite friends",
  },
  {
    key: "leaderboard",
    type: "middle",
    backgroundImage: "/main/leaderboard.png",
    redirectUrl: "",
    redirectLabel: "Leaderboard",
  },
];
