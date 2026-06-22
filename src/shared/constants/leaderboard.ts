/** Temporary UI mocks until leaderboard is wired to the API. */

export const LEADERBOARD_YOUR_PLACE = {
  id: "you",
  name: "Mizori",
  score: 1_000_000,
} as const;

export const LEADERBOARD_TOP_USERS = [
  { id: "lb-1", name: "Mizori", score: 500_000 },
  { id: "lb-2", name: "Aeloria", score: 1_200_000 },
  { id: "lb-3", name: "Krythos", score: 890_000 },
  { id: "lb-4", name: "Vespera", score: 750_000 },
  { id: "lb-5", name: "Zaroth", score: 620_000 },
  { id: "lb-6", name: "Nerith", score: 410_000 },
] as const;
