import type { MenuItem } from "@/shared/types/main";
import {
  PREDICTIONS_ALL_ROUTE,
  PREDICTIONS_CRYPTOCURRENCY_ROUTE,
  PREDICTIONS_ESPORTS_ROUTE,
  PREDICTIONS_RANDOM_REWARDS_ROUTE,
} from "@/lib/routes";

export const PREDICTIONS_MENU_ITEMS: MenuItem[] = [
  {
    key: "all-predictions",
    type: "large",
    title: "All predictions",
    description: "Every active market in one feed — crypto, esports, and random rewards.",
    backgroundImage: "/main/smart-predictions.png",
    redirectUrl: PREDICTIONS_ALL_ROUTE,
    redirectLabel: "View all",
  },
  {
    key: "random-distribution",
    type: "middle",
    backgroundImage: "/main/random-distribution.png",
    redirectUrl: PREDICTIONS_RANDOM_REWARDS_ROUTE,
    redirectLabel: "Random distribution",
  },
  {
    key: "financial-predictions",
    type: "middle",
    backgroundImage: "/main/financial-predictions.png",
    redirectUrl: PREDICTIONS_CRYPTOCURRENCY_ROUTE,
    redirectLabel: "Financial predictions",
  },
  {
    key: "e-sports-predictions",
    type: "middle",
    backgroundImage: "/main/e-sports-predictions.png",
    redirectUrl: PREDICTIONS_ESPORTS_ROUTE,
    redirectLabel: "E-sport predictions",
  },
];
