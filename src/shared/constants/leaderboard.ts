/** Temporary UI mocks until leaderboard is wired to the API. */

export const LEADERBOARD_YOUR_PLACE = {
  id: "you",
  name: "You",
  rank: 524,
  accountLevel: 1,
  score: 50,
} as const;

export const LEADERBOARD_TOP_USERS = [
  { id: "lb-1", name: "Mizori", score: 8100, accountLevel: 10 },
  { id: "lb-2", name: "Aeloria", score: 7950, accountLevel: 9 },
  { id: "lb-3", name: "Krythos", score: 7650, accountLevel: 9 },
  { id: "lb-4", name: "Vespera", score: 7300, accountLevel: 8 },
  { id: "lb-5", name: "Zaroth", score: 6200, accountLevel: 8 },
  { id: "lb-6", name: "Nerith", score: 4100, accountLevel: 7 },
] as const;
