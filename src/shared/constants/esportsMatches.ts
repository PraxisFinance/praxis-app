import type { EsportsMatch } from "@/shared/types/esportsMatch";

const MOCK_CPF_ADDRESS = "0x0000000000000000000000000000000000000001" as const;

function tagEsportsMatch(
  match: Omit<EsportsMatch, "predictionType" | "cpfAddress" | "cpfPoolId">,
): EsportsMatch {
  return { ...match, predictionType: "esports", cpfAddress: MOCK_CPF_ADDRESS, cpfPoolId: 0n };
}

/**
 * Mock matches for the esports list until the API exists.
 * `participantA` / `participantB.logoUrl` are left empty — real URLs will come from the backend.
 */
export const ESPORTS_MATCH_MOCKS: EsportsMatch[] = [
  tagEsportsMatch({
    id: "match-dota-live-1",
    gameId: "dota2",
    streamUrl: "https://www.youtube.com/live",
    isTradingOpen: true,
    status: { kind: "live", label: "Live now" },
    participantA: { name: "Inner Circle", logoUrl: "", odds: 1.35, score: 1 },
    participantB: { name: "AVULUS", logoUrl: "", odds: 3.4, score: 0 },
  }),
  tagEsportsMatch({
    id: "match-csgo-live-1",
    gameId: "csgo",
    streamUrl: "https://www.twitch.tv/example",
    isTradingOpen: true,
    status: { kind: "live" },
    participantA: { name: "Natus Vincere", logoUrl: "", odds: 1.55, score: 9 },
    participantB: { name: "FaZe Clan", logoUrl: "", odds: 2.35, score: 7 },
  }),
  tagEsportsMatch({
    id: "match-csgo-live-2",
    gameId: "csgo",
    isTradingOpen: false,
    status: { kind: "live", label: "Live now" },
    participantA: { name: "Team Spirit", logoUrl: "", odds: 2.1, score: 4 },
    participantB: { name: "MOUZ", logoUrl: "", odds: 1.72, score: 6 },
  }),
  tagEsportsMatch({
    id: "match-lol-upcoming-1",
    gameId: "lol",
    isTradingOpen: true,
    status: { kind: "upcoming", label: "Starts in 2h", startsAt: "2026-03-24T21:00:00.000Z" },
    participantA: { name: "T1", logoUrl: "", odds: 1.28 },
    participantB: { name: "Gen.G", logoUrl: "", odds: 3.6 },
  }),
  tagEsportsMatch({
    id: "match-valorant-finished-1",
    gameId: "valorant",
    isTradingOpen: false,
    status: { kind: "finished", label: "Final" },
    participantA: { name: "FNATIC", logoUrl: "", odds: 1.9, score: 2 },
    participantB: { name: "LOUD", logoUrl: "", odds: 1.9, score: 0 },
  }),
  tagEsportsMatch({
    id: "match-cod-upcoming-1",
    gameId: "cod",
    isTradingOpen: true,
    status: { kind: "upcoming", startsAt: "2026-03-25T18:30:00.000Z" },
    participantA: { name: "OpTic Texas", logoUrl: "", odds: 2.05 },
    participantB: { name: "Atlanta FaZe", logoUrl: "", odds: 1.75 },
  }),
];
