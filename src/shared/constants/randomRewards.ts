export const RANDOM_REWARDS_FILTERS = [
  { id: "all", label: "All" },
  { id: "live", label: "Live" },
  { id: "ended", label: "Ended" },
  { id: "1h", label: "1h" },
  { id: "12h", label: "12h" },
  { id: "1d", label: "1d" },
  { id: "1w", label: "1w" },
] as const;

export type RandomRewardsFilterId = (typeof RANDOM_REWARDS_FILTERS)[number]["id"];

/** Copy for the “Random pools” help drawer */
export const RANDOM_POOLS_HINT = {
  title: "How it works?",
  description:
    "Users stake their YT into one pool, and at the end of the game period, 3 random users divide the PnL amount between themselves.",
} as const;
