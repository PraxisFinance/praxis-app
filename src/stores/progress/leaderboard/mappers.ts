import type {
  ProgressLeaderboardApiItem,
  ProgressLeaderboardApiResponse,
  ProgressLeaderboardEntry,
  ProgressLeaderboardHydration,
} from "./types";

export function mapLeaderboardApiItem(item: ProgressLeaderboardApiItem): ProgressLeaderboardEntry {
  return {
    id: item.id,
    rank: item.rank,
    name: item.name,
    address: item.address,
    accountLevel: item.accountLevel,
    score: item.score,
  };
}

export function mapLeaderboardApiResponse(
  response: ProgressLeaderboardApiResponse,
): ProgressLeaderboardHydration {
  return {
    entries: response.entries.map(mapLeaderboardApiItem),
    userEntry: response.userEntry != null ? mapLeaderboardApiItem(response.userEntry) : null,
    userRank: response.userRank ?? response.userEntry?.rank ?? null,
  };
}
