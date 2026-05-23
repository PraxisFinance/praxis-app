/**
 * Envio GraphQL queries for the user history / portfolio feature.
 *
 * Public API — four typed fetch functions:
 *   fetchEnvioHead         → latest processed block (Q0)
 *   fetchAllUserEvents     → all user-scoped delta events, paginated (Q1)
 *   fetchUserDerivedState  → per-user Envio aggregates for touched markets (Q2)
 *   fetchGlobalState       → global pool/market state for touched markets (Q3)
 *
 * Q2 and Q3 are fired in parallel and both are skipped when all market-id
 * arrays are empty (cold-start user with no on-chain history).
 *
 * Cursor convention:
 *   Envio event IDs have the form `${CHAIN_ID}_${block12}_${logIndex5}`.
 *   The chain prefix is included in Envio `_gt` cursors but is STRIPPED
 *   before storing as `UserActivity.id` in Postgres.
 *
 * Chain ID is sourced from APP_CHAIN_ID (ensureAppChain.ts) — change it
 * there to switch networks globally.
 */

import { APP_CHAIN_ID } from "@/lib/ensureAppChain";
import { envioQuery } from "@/shared/api/envioClient";
import {
  EnvioHeadResponseSchema,
  GlobalStateResponseSchema,
  UserDeltaResponseSchema,
  UserDerivedStateResponseSchema,
} from "@/shared/types/envioRaw";
import type {
  EnvioHeadResponse,
  GlobalStateResponse,
  UserDeltaResponse,
  UserDerivedStateResponse,
} from "@/shared/types/envioRaw";

// ─── Cursor utilities ────────────────────────────────────────────────────────

/** `"${chainId}_"` — used as the chain prefix in Envio event IDs and cursors. */
const CHAIN_PREFIX = `${APP_CHAIN_ID}_`;

/**
 * Build an Envio `_gt` cursor from a block + log-index pair.
 * Zero-padding ensures lexicographic ordering matches numeric ordering.
 */
export function makeEventCursor(block: bigint, logIndex: number): string {
  return `${CHAIN_PREFIX}${String(block).padStart(12, "0")}_${String(logIndex).padStart(5, "0")}`;
}

/** Cursor that precedes every real event — use on cold-start (no cache). */
export const ZERO_CURSOR = `${CHAIN_PREFIX}000000000000_00000`;

/**
 * Convert an Envio event id to the compact form stored in `UserActivity.id`.
 * Strips the chain prefix; leaves the id unchanged if already stripped.
 */
export function envioIdToActivityId(envioId: string): string {
  return envioId.startsWith(CHAIN_PREFIX) ? envioId.slice(CHAIN_PREFIX.length) : envioId;
}

// ─── Constants ───────────────────────────────────────────────────────────────

/** Rows fetched per table per request in the Q1 pagination loop. */
const PAGE_SIZE = 200;

/** How many VaultDailySnapshot rows to fetch per vault in Q3. */
const VAULT_SNAPSHOT_LIMIT = 30;

// ─── Query documents ─────────────────────────────────────────────────────────

const ENVIO_HEAD_QUERY = /* GraphQL */ `
  query EnvioHead {
    chain_metadata(where: { chain_id: { _eq: ${APP_CHAIN_ID} } }) {
      latest_processed_block
    }
  }
`;

/**
 * All 12 user-scoped event tables in a single batched document.
 * Ordered by id (asc) to guarantee stable offset-based pagination.
 * Variables: cursor (exclusive lower bound), addr (lowercase), limit, offset.
 */
const USER_DELTA_QUERY = /* GraphQL */ `
  query UserDelta($cursor: String!, $addr: String!, $limit: Int!, $offset: Int!) {
    PraxisVault_Deposit(
      where: { id: { _gt: $cursor }, receiver: { _eq: $addr } }
      order_by: [{ id: asc }]
      limit: $limit
      offset: $offset
    ) {
      id vault principal buyIn receiver
    }
    PraxisVault_Withdraw(
      where: { id: { _gt: $cursor }, receiver: { _eq: $addr } }
      order_by: [{ id: asc }]
      limit: $limit
      offset: $offset
    ) {
      id vault amount yieldPayout receiver
    }
    PraxisVault_RedeemYield(
      where: { id: { _gt: $cursor }, receiver: { _eq: $addr } }
      order_by: [{ id: asc }]
      limit: $limit
      offset: $offset
    ) {
      id vault ytBurn payout receiver
    }
    PraxisRYD_Deposited(
      where: { id: { _gt: $cursor }, user: { _eq: $addr } }
      order_by: [{ id: asc }]
      limit: $limit
      offset: $offset
    ) {
      id ryd user amount
    }
    PraxisRYD_Withdrawn(
      where: { id: { _gt: $cursor }, user: { _eq: $addr } }
      order_by: [{ id: asc }]
      limit: $limit
      offset: $offset
    ) {
      id ryd user amount
    }
    PraxisRYD_PrizeClaimed(
      where: { id: { _gt: $cursor }, winner: { _eq: $addr } }
      order_by: [{ id: asc }]
      limit: $limit
      offset: $offset
    ) {
      id ryd winner amount
    }
    PraxisCPF_PlaceBet(
      where: { id: { _gt: $cursor }, user: { _eq: $addr } }
      order_by: [{ id: asc }]
      limit: $limit
      offset: $offset
    ) {
      id cpf poolId user amount inFavor
    }
    PraxisCPF_CancelBet(
      where: { id: { _gt: $cursor }, user: { _eq: $addr } }
      order_by: [{ id: asc }]
      limit: $limit
      offset: $offset
    ) {
      id cpf user poolId
    }
    PraxisCPF_RewardClaimed(
      where: { id: { _gt: $cursor }, user: { _eq: $addr } }
      order_by: [{ id: asc }]
      limit: $limit
      offset: $offset
    ) {
      id cpf poolId user payout
    }
    PraxisCPF_Withdraw(
      where: { id: { _gt: $cursor }, user: { _eq: $addr } }
      order_by: [{ id: asc }]
      limit: $limit
      offset: $offset
    ) {
      id cpf user amount
    }
    PraxisTwoPool_Deposited(
      where: { id: { _gt: $cursor }, user: { _eq: $addr } }
      order_by: [{ id: asc }]
      limit: $limit
      offset: $offset
    ) {
      id pool user side grossAmount fee netAmount
    }
    PraxisTwoPool_Claimed(
      where: { id: { _gt: $cursor }, user: { _eq: $addr } }
      order_by: [{ id: asc }]
      limit: $limit
      offset: $offset
    ) {
      id pool user side ytOut
    }
  }
`;

const USER_DERIVED_STATE_QUERY = /* GraphQL */ `
  query UserDerivedState(
    $addr: String!
    $vaultIds: [String!]!
    $rydIds: [String!]!
    $cpfPoolIds: [String!]!
    $twoPoolIds: [String!]!
  ) {
    UserPosition(where: { address: { _eq: $addr }, vault_id: { _in: $vaultIds } }) {
      id vault_id address totalDeposited totalWithdrawn currentBalance
      totalBuyInCost totalYieldClaimed depositCount firstDepositAt lastActivityAt
    }
    RYDParticipant(where: { address: { _eq: $addr }, ryd_id: { _in: $rydIds } }) {
      id ryd_id address depositAmount depositCount withdrawCount
      firstDepositAt lastActivityAt isWinner hasClaimed prizeAmount winProbabilityBps
    }
    RYDWinner(where: { address: { _eq: $addr }, ryd_id: { _in: $rydIds } }) {
      id ryd_id address rank prizeAmount depositedAmount winProbabilityBps claimedAt
    }
    CPFPoolPosition(where: { address: { _eq: $addr }, pool_id: { _in: $cpfPoolIds } }) {
      id cpfAddress pool_id address balanceInFavor balanceAgainst claimed lastActivityAt
    }
    TwoPoolUser(where: { address: { _eq: $addr }, pool_id: { _in: $twoPoolIds } }) {
      id pool_id address
      stableGrossDeposited stableFees stableNetDeposited stableDepositCount
      elevatedGrossDeposited elevatedFees elevatedNetDeposited elevatedDepositCount
      stableClaimedYt elevatedClaimedYt hasClaimedStable hasClaimedElevated
      firstDepositAt lastActivityAt
    }
  }
`;

const GLOBAL_STATE_QUERY = /* GraphQL */ `
  query GlobalState(
    $vaultIds: [String!]!
    $rydIds: [String!]!
    $cpfPoolIds: [String!]!
    $twoPoolIds: [String!]!
  ) {
    VaultState(where: { id: { _in: $vaultIds } }) {
      id maturity pt yt totalBalance totalYieldPaid isPaused lastUpdatedAt
    }
    VaultDailySnapshot(
      where: { vault_id: { _in: $vaultIds } }
      order_by: [{ vault_id: asc }, { timestamp: desc }]
      limit: ${VAULT_SNAPSHOT_LIMIT}
    ) {
      id vault_id date timestamp totalBalance dailyYield
    }
    RYDState(where: { id: { _in: $rydIds } }) {
      id vault yt endTime state totalDeposits participantCount numWinners
      minDeposit prizePerWinner vrfRequestId drawRequestedAt
      randomnessReceivedAt finishedAt totalClaimed claimsRemaining lastUpdatedAt
    }
    CPFPoolState(where: { id: { _in: $cpfPoolIds } }) {
      id cpfAddress poolId conditionId state
      stakeInFavor stakeAgainst winningOutcome totalWinningStake totalLosingStake
      createdAt resolvedAt lastUpdatedAt betCount uniqueBettors
    }
    TwoPoolState(where: { id: { _in: $twoPoolIds } }) {
      id state vault yt
      sideTVLStable sideTVLElevated
      subsidyBucketStable subsidyBucketElevated
      actualRate curveStableOut curveElevatedOut
      sideFinalAllocationStable sideFinalAllocationElevated
      totalClaimedYtStable totalClaimedYtElevated
      resolvedAt lastUpdatedAt
    }
  }
`;

// ─── Typed fetch functions ───────────────────────────────────────────────────

/**
 * Q0 — Fetch the latest block processed by the Envio indexer on Base.
 * Returns 0 when chain_metadata is unexpectedly empty.
 */
export async function fetchEnvioHead(): Promise<number> {
  const raw = await envioQuery<unknown>(ENVIO_HEAD_QUERY);
  const parsed = EnvioHeadResponseSchema.parse(raw) as EnvioHeadResponse;
  return parsed.chain_metadata[0]?.latest_processed_block ?? 0;
}

/**
 * Q1 — Fetch every user-scoped delta event since `cursor` (exclusive).
 *
 * Paginates with a shared limit+offset across all 12 event tables.
 * Continues fetching while any table returned exactly PAGE_SIZE rows
 * (indicating the table may have further rows at the next offset).
 *
 * @param cursor  Envio `_gt` cursor including the `8453_` prefix.
 * @param addr    User address in lowercase hex (Envio stores lowercase).
 */
export async function fetchAllUserEvents(
  cursor: string,
  addr: string
): Promise<UserDeltaResponse> {
  const accumulated: UserDeltaResponse = {
    PraxisVault_Deposit: [],
    PraxisVault_Withdraw: [],
    PraxisVault_RedeemYield: [],
    PraxisRYD_Deposited: [],
    PraxisRYD_Withdrawn: [],
    PraxisRYD_PrizeClaimed: [],
    PraxisCPF_PlaceBet: [],
    PraxisCPF_CancelBet: [],
    PraxisCPF_RewardClaimed: [],
    PraxisCPF_Withdraw: [],
    PraxisTwoPool_Deposited: [],
    PraxisTwoPool_Claimed: [],
  };

  const keys = Object.keys(accumulated) as (keyof UserDeltaResponse)[];
  let offset = 0;

  while (true) {
    const raw = await envioQuery<unknown>(USER_DELTA_QUERY, {
      cursor,
      addr,
      limit: PAGE_SIZE,
      offset,
    });

    const page = UserDeltaResponseSchema.parse(raw);

    for (const key of keys) {
      (accumulated[key] as unknown[]).push(...(page[key] as unknown[]));
    }

    // Any table returning a full page means there may be more rows.
    const hasMore = keys.some((key) => page[key].length === PAGE_SIZE);
    if (!hasMore) break;

    offset += PAGE_SIZE;
  }

  return accumulated;
}

export type TouchedMarkets = {
  vaultIds: string[];
  rydIds: string[];
  /** Format: `${cpfAddress}:${poolId}` */
  cpfPoolIds: string[];
  twoPoolIds: string[];
};

/**
 * Q2 — Fetch per-user Envio aggregates for the given touched markets.
 *
 * Returns null when all market-id arrays are empty (no history to fetch).
 *
 * @param addr   User address in lowercase hex.
 * @param markets Product addresses the user has interacted with.
 */
export async function fetchUserDerivedState(
  addr: string,
  markets: TouchedMarkets
): Promise<UserDerivedStateResponse | null> {
  const { vaultIds, rydIds, cpfPoolIds, twoPoolIds } = markets;
  if (
    vaultIds.length === 0 &&
    rydIds.length === 0 &&
    cpfPoolIds.length === 0 &&
    twoPoolIds.length === 0
  ) {
    return null;
  }

  const raw = await envioQuery<unknown>(USER_DERIVED_STATE_QUERY, {
    addr,
    vaultIds,
    rydIds,
    cpfPoolIds,
    twoPoolIds,
  });

  return UserDerivedStateResponseSchema.parse(raw);
}

/**
 * Q3 — Fetch global pool/market state for the given touched markets.
 *
 * Returns null when all market-id arrays are empty.
 *
 * @param markets Product addresses the user has interacted with.
 */
export async function fetchGlobalState(
  markets: TouchedMarkets
): Promise<GlobalStateResponse | null> {
  const { vaultIds, rydIds, cpfPoolIds, twoPoolIds } = markets;
  if (
    vaultIds.length === 0 &&
    rydIds.length === 0 &&
    cpfPoolIds.length === 0 &&
    twoPoolIds.length === 0
  ) {
    return null;
  }

  const raw = await envioQuery<unknown>(GLOBAL_STATE_QUERY, {
    vaultIds,
    rydIds,
    cpfPoolIds,
    twoPoolIds,
  });

  return GlobalStateResponseSchema.parse(raw);
}

/**
 * Fetch Q2 and Q3 in parallel for the given user + touched markets.
 * Both return null for a cold-start user with no on-chain history.
 */
export async function fetchDerivedAndGlobalState(
  addr: string,
  markets: TouchedMarkets
): Promise<{
  derived: UserDerivedStateResponse | null;
  global: GlobalStateResponse | null;
}> {
  const [derived, global] = await Promise.all([
    fetchUserDerivedState(addr, markets),
    fetchGlobalState(markets),
  ]);
  return { derived, global };
}
