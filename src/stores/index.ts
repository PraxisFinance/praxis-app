export {
  useEventsStore,
  loadMockEvents,
  isSportEvent,
  isEconomicEvent,
  isRandomEvent,
  formatPool,
  getTimeUntilLock,
  type Event,
  type SportEvent,
  type EconomicEvent,
  type RandomEvent,
} from "./eventsStore";

export { useClaimsStore, loadMockClaims, formatIncome, type Claim } from "./claimsStore";

export {
  useDepositsStore,
  loadMockDeposits,
  formatUSDC,
  getTimeUntilMaturity,
  getStakeDuration,
  type Vault,
  type UserPosition,
} from "./depositsStore";

export {
  useHistoryStore,
  loadMockHistory,
  formatHistoryTime,
  formatHistoryAmount,
  type HistoryItem,
} from "./historyStore";

export { useReferralsStore, loadMockReferrals, formatScore, type Referral } from "./referralsStore";

export {
  useLeaderboardStore,
  loadMockLeaderboard,
  formatRank,
  type LeaderboardEntry,
} from "./leaderboardStore";

export {
  useStatisticsStore,
  loadMockStatistics,
  formatChartDate,
  formatWinRate,
  type BalanceChartPoint,
  type PredictionChartPoint,
  type PredictionHistoryItem,
} from "./statisticsStore";
