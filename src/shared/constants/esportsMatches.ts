import type { EsportsMatch } from "@/shared/types/esportsMatch";

/**
 * Mock matches for the esports list until the API exists.
 * `team1` / `team2.logoUrl` are left empty — real URLs will come from the backend.
 */
export const ESPORTS_MATCH_MOCKS: EsportsMatch[] = [
  {
    id: "match-dota-live-1",
    gameId: "dota2",
    streamUrl: "https://www.youtube.com/live",
    isBettingAvailable: true,
    status: { kind: "live", label: "Live now" },
    team1: { name: "Inner Circle", logoUrl: "", odds: 1.35, score: 1 },
    team2: { name: "AVULUS", logoUrl: "", odds: 3.4, score: 0 },
  },
  {
    id: "match-csgo-live-1",
    gameId: "csgo",
    streamUrl: "https://www.twitch.tv/example",
    isBettingAvailable: true,
    status: { kind: "live" },
    team1: { name: "Natus Vincere", logoUrl: "", odds: 1.55, score: 9 },
    team2: { name: "FaZe Clan", logoUrl: "", odds: 2.35, score: 7 },
  },
  {
    id: "match-csgo-live-2",
    gameId: "csgo",
    isBettingAvailable: false,
    status: { kind: "live", label: "Live now" },
    team1: { name: "Team Spirit", logoUrl: "", odds: 2.1, score: 4 },
    team2: { name: "MOUZ", logoUrl: "", odds: 1.72, score: 6 },
  },
  {
    id: "match-lol-upcoming-1",
    gameId: "lol",
    isBettingAvailable: true,
    status: { kind: "upcoming", label: "Starts in 2h", startsAt: "2026-03-24T21:00:00.000Z" },
    team1: { name: "T1", logoUrl: "", odds: 1.28 },
    team2: { name: "Gen.G", logoUrl: "", odds: 3.6 },
  },
  {
    id: "match-valorant-finished-1",
    gameId: "valorant",
    isBettingAvailable: false,
    status: { kind: "finished", label: "Final" },
    team1: { name: "FNATIC", logoUrl: "", odds: 1.9, score: 2 },
    team2: { name: "LOUD", logoUrl: "", odds: 1.9, score: 0 },
  },
  {
    id: "match-cod-upcoming-1",
    gameId: "cod",
    isBettingAvailable: true,
    status: { kind: "upcoming", startsAt: "2026-03-25T18:30:00.000Z" },
    team1: { name: "OpTic Texas", logoUrl: "", odds: 2.05 },
    team2: { name: "Atlanta FaZe", logoUrl: "", odds: 1.75 },
  },
];
