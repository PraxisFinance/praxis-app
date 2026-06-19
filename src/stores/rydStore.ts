import { create } from "zustand";
import { envioQuery, toBigInt } from "@/shared/api/envioClient";
import { trpcClient } from "@/lib/trpc/vanillaClient";
import { useActiveVaultStore } from "@/stores/activeVaultStore";
import type { RandomPoolRemainingTime } from "@/shared/types/predictions";

// ── Configuration ────────────────────────────────────────────────────

/** Max participants pulled per RYD (ordered by deposit size). */
const PARTICIPANTS_LIMIT = 100;
/** Max daily snapshots pulled per RYD (most recent first). */
const SNAPSHOTS_LIMIT = 30;
/** Decimals of the deposit token (USDC). */
const USDC_DECIMALS = 6;
/** Basis points in one percent (10000 bps = 100%). */
const BPS_PER_PERCENT = 100;

// ── Envio-derived types ──────────────────────────────────────────────

export type RYDStatus = "Open" | "DrawRequested" | "ReadyToResolve" | "Finished";

export interface RYDState {
  id: string;
  vault: string;
  yt: string;
  endTime: bigint;
  state: RYDStatus;
  totalDeposits: bigint;
  participantCount: number;
  numWinners: number;
  minDeposit: bigint;
  prizePerWinner: bigint;
  vrfRequestId: bigint;
  drawRequestedAt: bigint;
  randomnessReceivedAt: bigint;
  finishedAt: bigint;
  totalClaimed: bigint;
  claimsRemaining: number;
  lastUpdatedAt: bigint;
}

export interface RYDParticipant {
  id: string;
  address: string;
  depositAmount: bigint;
  depositCount: number;
  withdrawCount: number;
  firstDepositAt: bigint;
  lastActivityAt: bigint;
  isWinner: boolean;
  hasClaimed: boolean;
  prizeAmount: bigint;
  winProbabilityBps: number;
}

export interface RYDWinner {
  id: string;
  address: string;
  rank: number;
  prizeAmount: bigint;
  depositedAmount: bigint;
  winProbabilityBps: number;
  claimedAt: bigint;
}

export interface RYDDailySnapshot {
  id: string;
  date: string;
  timestamp: bigint;
  totalDeposits: bigint;
  participantCount: number;
  dailyDeposits: bigint;
  dailyWithdrawals: bigint;
  netFlow: bigint;
}

export interface RYDDepositEvent {
  id: string;
  user: string;
  amount: bigint;
}

export interface RYDWithdrawEvent {
  id: string;
  user: string;
  amount: bigint;
}

export interface RYDDrawRequestedEvent {
  id: string;
  requestId: bigint;
}

export interface RYDWinnersSelectedEvent {
  id: string;
  winners: string[];
  prizePerWinner: bigint;
}

export interface RYDRandomnessReceivedEvent {
  id: string;
  requestId: bigint;
}

export interface RYDPrizeClaimedEvent {
  id: string;
  winner: string;
  amount: bigint;
}

// ── Offchain contract metadata (from DB via tRPC) ────────────────────

export interface RydContractMeta {
  /** Matches RYDState.id */
  address: string;
  name: string;
  /** ISO 8601 — when the pool was created; used to compute progressPercent */
  createdAt: string;
  /** ISO 8601 — pool end time from DB (mirrors on-chain endTime) */
  endTime: string;
}

// ── Per-RYD data bundle ──────────────────────────────────────────────

export interface RYDData {
  state: RYDState | null;
  participants: RYDParticipant[];
  winners: RYDWinner[];
  dailySnapshots: RYDDailySnapshot[];
  userParticipation: RYDParticipant | null;
  /** Offchain metadata fetched from DB. Null if not yet loaded or no DB record. */
  contractMeta: RydContractMeta | null;
}


// ── Store ────────────────────────────────────────────────────────────

interface RYDStoreState {
  ryds: Record<string, RYDData>;
  activeRYDId: string | null;
  loading: boolean;
  error: string | null;
}

interface RYDStoreActions {
  setActiveRYD: (id: string) => void;
  getActiveRYD: () => RYDData | undefined;
  getRYD: (id: string) => RYDData | undefined;

  fetchAll: (userAddress?: string) => Promise<void>;
  fetchAllRYDStates: () => Promise<void>;

  reset: () => void;
}

type RYDStore = RYDStoreState & RYDStoreActions;

const initialState: RYDStoreState = {
  ryds: {},
  activeRYDId: null,
  loading: false,
  error: null,
};

// ── GraphQL queries ──────────────────────────────────────────────────
// Field selections are defined once and composed into the queries below so
// the bootstrap and full-load variants can never drift out of sync.

const RYD_STATE_FIELDS = `
  id
  vault
  yt
  endTime
  state
  totalDeposits
  participantCount
  numWinners
  minDeposit
  prizePerWinner
  vrfRequestId
  drawRequestedAt
  randomnessReceivedAt
  finishedAt
  totalClaimed
  claimsRemaining
  lastUpdatedAt
`;

const PARTICIPANT_FIELDS = `
  id
  address
  depositAmount
  depositCount
  withdrawCount
  firstDepositAt
  lastActivityAt
  isWinner
  hasClaimed
  prizeAmount
  winProbabilityBps
`;

const WINNER_FIELDS = `
  id
  address
  rank
  prizeAmount
  depositedAmount
  winProbabilityBps
  claimedAt
`;

const SNAPSHOT_FIELDS = `
  id
  date
  timestamp
  totalDeposits
  participantCount
  dailyDeposits
  dailyWithdrawals
  netFlow
`;

/** Selections shared by both the bootstrap and full-load queries. */
const RYD_SHARED_SELECTIONS = `
  RYDState { ${RYD_STATE_FIELDS} }
  participants: RYDParticipant(order_by: { depositAmount: desc }, limit: ${PARTICIPANTS_LIMIT}) {
    ${PARTICIPANT_FIELDS}
  }
  winners: RYDWinner(order_by: { rank: asc }) { ${WINNER_FIELDS} }
  snapshots: RYDDailySnapshot(order_by: { timestamp: desc }, limit: ${SNAPSHOTS_LIMIT}) {
    ${SNAPSHOT_FIELDS}
  }
`;

const RYD_FULL_LOAD_QUERY = `
  query RYDFullLoad($address: String!) {
    ${RYD_SHARED_SELECTIONS}
    userParticipation: RYDParticipant(where: { address: { _eq: $address } }, limit: 1) {
      ${PARTICIPANT_FIELDS}
    }
  }
`;

const RYD_BOOTSTRAP_QUERY = `
  query RYDBootstrap {
    ${RYD_SHARED_SELECTIONS}
  }
`;

// ── Batched response types ────────────────────────────────────────────

interface RYDBootstrapResponse {
  RYDState: RawRYDState[];
  participants: RawRYDParticipant[];
  winners: RawRYDWinner[];
  snapshots: RawRYDSnapshot[];
}

interface RYDFullLoadResponse extends RYDBootstrapResponse {
  userParticipation: RawRYDParticipant[];
}

/** Normalized raw payload, independent of which query produced it. */
interface RawRYDPayload {
  rydStates: RawRYDState[];
  participants: RawRYDParticipant[];
  winners: RawRYDWinner[];
  snapshots: RawRYDSnapshot[];
  userParticipation: RawRYDParticipant | null;
}

// ── Raw → typed mappers ──────────────────────────────────────────────

interface RawRYDState {
  id: string;
  vault: string;
  yt: string;
  endTime: string;
  state: string;
  totalDeposits: string;
  participantCount: number;
  numWinners: number;
  minDeposit: string;
  prizePerWinner: string;
  vrfRequestId: string;
  drawRequestedAt: string;
  randomnessReceivedAt: string;
  finishedAt: string;
  totalClaimed: string;
  claimsRemaining: number;
  lastUpdatedAt: string;
}

function mapRYDState(raw: RawRYDState): RYDState {
  return {
    id: raw.id,
    vault: raw.vault,
    yt: raw.yt,
    endTime: toBigInt(raw.endTime),
    state: raw.state as RYDStatus,
    totalDeposits: toBigInt(raw.totalDeposits),
    participantCount: raw.participantCount,
    numWinners: raw.numWinners,
    minDeposit: toBigInt(raw.minDeposit),
    prizePerWinner: toBigInt(raw.prizePerWinner),
    vrfRequestId: toBigInt(raw.vrfRequestId),
    drawRequestedAt: toBigInt(raw.drawRequestedAt),
    randomnessReceivedAt: toBigInt(raw.randomnessReceivedAt),
    finishedAt: toBigInt(raw.finishedAt),
    totalClaimed: toBigInt(raw.totalClaimed),
    claimsRemaining: raw.claimsRemaining,
    lastUpdatedAt: toBigInt(raw.lastUpdatedAt),
  };
}

interface RawRYDParticipant {
  id: string;
  address: string;
  depositAmount: string;
  depositCount: number;
  withdrawCount: number;
  firstDepositAt: string;
  lastActivityAt: string;
  isWinner: boolean;
  hasClaimed: boolean;
  prizeAmount: string;
  winProbabilityBps: number;
}

function mapParticipant(raw: RawRYDParticipant): RYDParticipant {
  return {
    id: raw.id,
    address: raw.address,
    depositAmount: toBigInt(raw.depositAmount),
    depositCount: raw.depositCount,
    withdrawCount: raw.withdrawCount,
    firstDepositAt: toBigInt(raw.firstDepositAt),
    lastActivityAt: toBigInt(raw.lastActivityAt),
    isWinner: raw.isWinner,
    hasClaimed: raw.hasClaimed,
    prizeAmount: toBigInt(raw.prizeAmount),
    winProbabilityBps: raw.winProbabilityBps,
  };
}

interface RawRYDWinner {
  id: string;
  address: string;
  rank: number;
  prizeAmount: string;
  depositedAmount: string;
  winProbabilityBps: number;
  claimedAt: string;
}

function mapWinner(raw: RawRYDWinner): RYDWinner {
  return {
    id: raw.id,
    address: raw.address,
    rank: raw.rank,
    prizeAmount: toBigInt(raw.prizeAmount),
    depositedAmount: toBigInt(raw.depositedAmount),
    winProbabilityBps: raw.winProbabilityBps,
    claimedAt: toBigInt(raw.claimedAt),
  };
}

interface RawRYDSnapshot {
  id: string;
  date: string;
  timestamp: string;
  totalDeposits: string;
  participantCount: number;
  dailyDeposits: string;
  dailyWithdrawals: string;
  netFlow: string;
}

function mapRYDSnapshot(raw: RawRYDSnapshot): RYDDailySnapshot {
  return {
    id: raw.id,
    date: raw.date,
    timestamp: toBigInt(raw.timestamp),
    totalDeposits: toBigInt(raw.totalDeposits),
    participantCount: raw.participantCount,
    dailyDeposits: toBigInt(raw.dailyDeposits),
    dailyWithdrawals: toBigInt(raw.dailyWithdrawals),
    netFlow: toBigInt(raw.netFlow),
  };
}

// ── Data-loading helpers ─────────────────────────────────────────────

/** Runs the appropriate Envio query and normalizes it to a single shape. */
async function fetchRawRYDPayload(userAddress?: string): Promise<RawRYDPayload> {
  if (userAddress) {
    const data = await envioQuery<RYDFullLoadResponse>(RYD_FULL_LOAD_QUERY, {
      address: userAddress.toLowerCase(),
    });
    return {
      rydStates: data.RYDState,
      participants: data.participants,
      winners: data.winners,
      snapshots: data.snapshots,
      userParticipation: data.userParticipation[0] ?? null,
    };
  }

  const data = await envioQuery<RYDBootstrapResponse>(RYD_BOOTSTRAP_QUERY);
  return {
    rydStates: data.RYDState,
    participants: data.participants,
    winners: data.winners,
    snapshots: data.snapshots,
    userParticipation: null,
  };
}

/** Batch-fetches offchain contract metadata, keyed by lowercased address. */
async function fetchContractMetaByAddress(
  addresses: string[],
): Promise<Record<string, RydContractMeta>> {
  if (addresses.length === 0) return {};
  const rows = await trpcClient.rydContracts.byAddresses.query({ addresses });
  return Object.fromEntries(rows.map((m) => [m.address.toLowerCase(), m]));
}

/** Assembles the typed per-RYD bundle from a raw state row and shared payload. */
function buildRYDData(
  raw: RawRYDState,
  payload: RawRYDPayload,
  contractMetaByAddress: Record<string, RydContractMeta>,
): RYDData {
  return {
    state: mapRYDState(raw),
    participants: payload.participants.map(mapParticipant),
    winners: payload.winners.map(mapWinner),
    dailySnapshots: payload.snapshots.map(mapRYDSnapshot),
    userParticipation: payload.userParticipation
      ? mapParticipant(payload.userParticipation)
      : null,
    contractMeta: contractMetaByAddress[raw.id.toLowerCase()] ?? null,
  };
}

// ── Zustand store ────────────────────────────────────────────────────

export const useRYDStore = create<RYDStore>((set, get) => ({
  ...initialState,

  setActiveRYD: (id) => set({ activeRYDId: id }),

  getActiveRYD: () => {
    const { ryds, activeRYDId } = get();
    return activeRYDId ? ryds[activeRYDId] : undefined;
  },

  getRYD: (id) => get().ryds[id],

  fetchAll: async (userAddress) => {
    set({ loading: true, error: null });
    try {
      const activeYt = useActiveVaultStore.getState().activeYtAddress;
      const payload = await fetchRawRYDPayload(userAddress);

      const scopedRows = activeYt
        ? payload.rydStates.filter((raw) => raw.yt.toLowerCase() === activeYt.toLowerCase())
        : [];

      const contractMetaByAddress = await fetchContractMetaByAddress(
        scopedRows.map((r) => r.id),
      );

      const nextRyds: Record<string, RYDData> = {};
      for (const raw of scopedRows) {
        nextRyds[raw.id] = buildRYDData(raw, payload, contractMetaByAddress);
      }

      const activeId = get().activeRYDId;
      set({
        ryds: nextRyds,
        activeRYDId: activeId && nextRyds[activeId] ? activeId : (scopedRows[0]?.id ?? null),
        loading: false,
      });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  fetchAllRYDStates: async () => {
    await get().fetchAll();
  },

  reset: () => set({ ...initialState, ryds: {} }),
}));

// ── Formatting helpers ───────────────────────────────────────────────

export const formatRYDAmount = (amount: bigint, decimals = USDC_DECIMALS): string => {
  const value = Number(amount) / 10 ** decimals;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatWinProbability = (bps: number): string => {
  return `${(bps / BPS_PER_PERCENT).toFixed(2)}%`;
};

const RYD_STATUS_LABELS: Record<RYDStatus, string> = {
  Open: "Open",
  DrawRequested: "Drawing…",
  ReadyToResolve: "Ready to Resolve",
  Finished: "Finished",
};

export const formatRYDStatus = (status: RYDStatus): string => RYD_STATUS_LABELS[status];

export const shortenAddress = (address: string): string => {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
};

/**
 * Maps the on-chain RYD status to a hub-card status kind.
 * `ReadyToResolve` is treated as ended-but-not-yet-settled.
 */
export const mapRYDStatusToHubKind = (status: RYDStatus): "live" | "ended" => {
  return status === "Finished" || status === "ReadyToResolve" ? "ended" : "live";
};

/**
 * Computes a 0–100 progress percentage for a live pool using the
 * offchain `createdAt` / `endTime` from the DB record.
 * Returns 0 if metadata is absent or the window is invalid.
 */
export const computeRYDProgressPercent = (
  meta: RydContractMeta | null,
  nowMs = Date.now(),
): number => {
  if (!meta) return 0;
  const start = new Date(meta.createdAt).getTime();
  const end = new Date(meta.endTime).getTime();
  const duration = end - start;
  if (duration <= 0) return 0;
  return Math.min(100, Math.max(0, ((nowMs - start) / duration) * 100));
};

/**
 * Converts an on-chain Unix-seconds end-time to a countdown object.
 * Returns all-zeroes when the pool has already expired.
 */
export function computeRYDRemainingTime(
  endTimeSec: bigint,
  nowMs = Date.now(),
): RandomPoolRemainingTime {
  const diffMs = Math.max(0, Number(endTimeSec) * 1000 - nowMs);
  const totalSeconds = Math.floor(diffMs / 1000);
  return {
    days:    Math.floor(totalSeconds / 86400),
    hours:   Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

useActiveVaultStore.subscribe(
  (state) => state.activeYtAddress,
  (next, prev) => {
    if (next !== prev) {
      void useRYDStore.getState().fetchAllRYDStates();
    }
  }
);
