import { describe, it, expect } from "vitest";
import {
  valuateVault,
  valuateRyd,
  valuateCpf,
  valuateTwoPool,
  computeFreeYt,
  computePortfolio,
} from "../valuationMappers";
import type {
  RawUserPosition,
  RawRYDParticipant,
  RawRYDWinner,
  RawRYDState,
  RawCPFPoolPosition,
  RawCPFPoolState,
  RawTwoPoolUser,
  RawTwoPoolHistoryState,
  RawVaultState,
  UserDerivedStateResponse,
  GlobalStateResponse,
} from "@/shared/types/envioRaw";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const USER = "0xuser000000000000000000000000000000001";
const VAULT_ID = "0xvault00000000000000000000000000000001";
const RYD_ID = "0xryd000000000000000000000000000000001";
const CPF_ADDR = "0xcpf000000000000000000000000000000001";
const POOL_ID = "42";
/** Envio entity id for CPF pools — `${cpfAddress}_${numericPoolId}`. */
const CPF_POOL_ENTITY_ID = `${CPF_ADDR}_${POOL_ID}`;
const TWOPOOL_ID = "0xpool00000000000000000000000000000001";

function makeVaultState(overrides: Partial<RawVaultState> = {}): RawVaultState {
  return {
    id: VAULT_ID,
    maturity: "9999999999",
    pt: "0xpt",
    yt: "0xyt",
    totalBalance: "10000000",
    totalYieldPaid: "1000000",
    isPaused: false,
    lastUpdatedAt: "1700000000",
    ...overrides,
  };
}

function makeUserPosition(overrides: Partial<RawUserPosition> = {}): RawUserPosition {
  return {
    id: `${VAULT_ID}:${USER}`,
    vault_id: VAULT_ID,
    address: USER,
    totalDeposited: "5000000",
    totalWithdrawn: "0",
    currentBalance: "5000000",
    totalBuyInCost: "4950000",
    totalYieldClaimed: "0",
    depositCount: 1,
    firstDepositAt: "1700000000",
    lastActivityAt: "1700000000",
    ...overrides,
  };
}

function makeRydState(overrides: Partial<RawRYDState> = {}): RawRYDState {
  return {
    id: RYD_ID,
    vault: VAULT_ID,
    yt: "0xyt",
    endTime: "1800000000",
    state: "OPEN",
    totalDeposits: "10000000",
    participantCount: 5,
    numWinners: 1,
    minDeposit: "1000000",
    prizePerWinner: "10000000",
    vrfRequestId: "0",
    drawRequestedAt: "0",
    randomnessReceivedAt: "0",
    finishedAt: "0",
    totalClaimed: "0",
    claimsRemaining: 1,
    lastUpdatedAt: "1700000000",
    ...overrides,
  };
}

function makeRydParticipant(overrides: Partial<RawRYDParticipant> = {}): RawRYDParticipant {
  return {
    id: `${RYD_ID}:${USER}`,
    ryd_id: RYD_ID,
    address: USER,
    depositAmount: "2000000",
    depositCount: 1,
    withdrawCount: 0,
    firstDepositAt: "1700000000",
    lastActivityAt: "1700000000",
    isWinner: false,
    hasClaimed: false,
    prizeAmount: "0",
    winProbabilityBps: 2000,
    ...overrides,
  };
}

function makeRydWinner(overrides: Partial<RawRYDWinner> = {}): RawRYDWinner {
  return {
    id: `${RYD_ID}:${USER}`,
    ryd_id: RYD_ID,
    address: USER,
    rank: 1,
    prizeAmount: "10000000",
    depositedAmount: "2000000",
    winProbabilityBps: 2000,
    claimedAt: "0",
    ...overrides,
  };
}

function makeCpfPoolState(overrides: Partial<RawCPFPoolState> = {}): RawCPFPoolState {
  return {
    id: CPF_POOL_ENTITY_ID,
    cpfAddress: CPF_ADDR,
    poolId: POOL_ID,
    conditionId: "",
    state: "OPEN",
    stakeInFavor: "6000000",
    stakeAgainst: "4000000",
    winningOutcome: "",
    totalWinningStake: "0",
    totalLosingStake: "0",
    createdAt: "1700000000",
    resolvedAt: "0",
    lastUpdatedAt: "1700000000",
    betCount: 3,
    uniqueBettors: 2,
    ...overrides,
  };
}

function makeCpfPoolPosition(overrides: Partial<RawCPFPoolPosition> = {}): RawCPFPoolPosition {
  return {
    id: `${CPF_POOL_ENTITY_ID}:${USER}`,
    cpfAddress: CPF_ADDR,
    pool_id: CPF_POOL_ENTITY_ID,
    address: USER,
    balanceInFavor: "1000000",
    balanceAgainst: "0",
    claimed: false,
    lastActivityAt: "1700000000",
    ...overrides,
  };
}

function makeTwoPoolState(overrides: Partial<RawTwoPoolHistoryState> = {}): RawTwoPoolHistoryState {
  return {
    id: TWOPOOL_ID,
    state: "OPEN",
    vault: VAULT_ID,
    yt: "0xyt",
    sideTVLStable: "5000000",
    sideTVLElevated: "3000000",
    subsidyBucketStable: "0",
    subsidyBucketElevated: "0",
    actualRate: "0",
    curveStableOut: "0",
    curveElevatedOut: "0",
    sideFinalAllocationStable: "0",
    sideFinalAllocationElevated: "0",
    totalClaimedYtStable: "0",
    totalClaimedYtElevated: "0",
    resolvedAt: "0",
    lastUpdatedAt: "1700000000",
    ...overrides,
  };
}

function makeTwoPoolUser(overrides: Partial<RawTwoPoolUser> = {}): RawTwoPoolUser {
  return {
    id: `${TWOPOOL_ID}:${USER}`,
    pool_id: TWOPOOL_ID,
    address: USER,
    stableGrossDeposited: "1020000",
    stableFees: "20000",
    stableNetDeposited: "1000000",
    stableDepositCount: 1,
    elevatedGrossDeposited: "0",
    elevatedFees: "0",
    elevatedNetDeposited: "0",
    elevatedDepositCount: 0,
    stableClaimedYt: "0",
    elevatedClaimedYt: "0",
    hasClaimedStable: false,
    hasClaimedElevated: false,
    firstDepositAt: "1700000000",
    lastActivityAt: "1700000000",
    ...overrides,
  };
}

// ─── valuateVault ─────────────────────────────────────────────────────────────

describe("valuateVault", () => {
  it("returns zero for undefined position", () => {
    const { principal, claimableYield } = valuateVault(undefined, makeVaultState());
    expect(principal).toBe(0n);
    expect(claimableYield).toBe(0n);
  });

  it("computes principal from currentBalance", () => {
    const pos = makeUserPosition({ currentBalance: "5000000" });
    const { principal } = valuateVault(pos, makeVaultState());
    expect(principal).toBe(5_000_000n);
  });

  it("computes claimable yield proportionally", () => {
    // User holds 5/10 of the vault, vault paid 1_000_000 total yield → user entitled 500_000
    const pos = makeUserPosition({ currentBalance: "5000000", totalYieldClaimed: "0" });
    const state = makeVaultState({ totalBalance: "10000000", totalYieldPaid: "1000000" });
    const { claimableYield } = valuateVault(pos, state);
    expect(claimableYield).toBe(500_000n);
  });

  it("subtracts already-claimed yield", () => {
    const pos = makeUserPosition({ currentBalance: "5000000", totalYieldClaimed: "300000" });
    const state = makeVaultState({ totalBalance: "10000000", totalYieldPaid: "1000000" });
    const { claimableYield } = valuateVault(pos, state);
    expect(claimableYield).toBe(200_000n);
  });

  it("clamps claimableYield to 0 when fully claimed", () => {
    const pos = makeUserPosition({ currentBalance: "5000000", totalYieldClaimed: "600000" });
    const state = makeVaultState({ totalBalance: "10000000", totalYieldPaid: "1000000" });
    const { claimableYield } = valuateVault(pos, state);
    expect(claimableYield).toBe(0n);
  });

  it("handles zero totalBalance (indexer lag) without throwing", () => {
    const pos = makeUserPosition({ currentBalance: "5000000", totalYieldClaimed: "0" });
    const state = makeVaultState({ totalBalance: "0", totalYieldPaid: "1000000" });
    const { claimableYield } = valuateVault(pos, state);
    expect(claimableYield).toBe(0n);
  });
});

// ─── valuateRyd ───────────────────────────────────────────────────────────────

describe("valuateRyd", () => {
  it("returns zero for undefined participant", () => {
    const { locked, claimable } = valuateRyd(undefined, undefined, makeRydState());
    expect(locked).toBe(0n);
    expect(claimable).toBe(0n);
  });

  it("locks principal while OPEN", () => {
    const p = makeRydParticipant({ depositAmount: "2000000" });
    const { locked, claimable } = valuateRyd(p, undefined, makeRydState({ state: "OPEN" }));
    expect(locked).toBe(2_000_000n);
    expect(claimable).toBe(0n);
  });

  it("shows prize as claimable when CLOSED and user is winner", () => {
    const p = makeRydParticipant({ depositAmount: "0", isWinner: true, hasClaimed: false, prizeAmount: "10000000" });
    const state = makeRydState({ state: "CLOSED" });
    const { locked, claimable } = valuateRyd(p, makeRydWinner(), state);
    expect(claimable).toBe(10_000_000n);
    expect(locked).toBe(0n);
  });

  it("shows zero when CLOSED and user is not winner", () => {
    const p = makeRydParticipant({ isWinner: false, hasClaimed: false, prizeAmount: "0" });
    const { locked, claimable } = valuateRyd(p, undefined, makeRydState({ state: "CLOSED" }));
    expect(locked).toBe(0n);
    expect(claimable).toBe(0n);
  });

  it("shows zero when CLOSED and winner has already claimed", () => {
    const p = makeRydParticipant({ isWinner: true, hasClaimed: true, prizeAmount: "10000000" });
    const { locked, claimable } = valuateRyd(p, undefined, makeRydState({ state: "CLOSED" }));
    expect(claimable).toBe(0n);
  });
});

// ─── valuateCpf ──────────────────────────────────────────────────────────────

describe("valuateCpf", () => {
  it("returns zero for undefined position", () => {
    const { open, claimable } = valuateCpf(undefined, makeCpfPoolState());
    expect(open).toBe(0n);
    expect(claimable).toBe(0n);
  });

  it("computes mark-to-market for open FOR-side bet", () => {
    // Pool: 6M FOR / 4M AGAINST → FOR side stake = 6/10 × total → mark = 1M × (6M/10M) = 600k
    const pos = makeCpfPoolPosition({ balanceInFavor: "1000000", balanceAgainst: "0" });
    const state = makeCpfPoolState({ stakeInFavor: "6000000", stakeAgainst: "4000000", winningOutcome: "" });
    const { open } = valuateCpf(pos, state);
    expect(open).toBe(600_000n);
  });

  it("caps mark value at 2× stake", () => {
    // Extreme skew: FOR is 99% of pool → mark = 1M × (9.9M/10M) ≈ 990k which is < 2M cap
    const pos = makeCpfPoolPosition({ balanceInFavor: "1000000", balanceAgainst: "0" });
    const state = makeCpfPoolState({ stakeInFavor: "9900000", stakeAgainst: "100000", winningOutcome: "" });
    const { open } = valuateCpf(pos, state);
    // mark = 1M × 9.9M/10M = 990k — less than cap of 2M
    expect(open).toBe(990_000n);
  });

  it("pays out winners proportionally when pool is resolved FOR", () => {
    const pos = makeCpfPoolPosition({ balanceInFavor: "1000000", balanceAgainst: "0", claimed: false });
    const state = makeCpfPoolState({
      state: "RESOLVED",
      winningOutcome: "FOR",
      totalWinningStake: "6000000",
      totalLosingStake: "4000000",
      resolvedAt: "1700100000",
    });
    // payout = 1M / 6M × 10M = 1.666…M → truncated to 1_666_666
    const { claimable } = valuateCpf(pos, state);
    expect(claimable).toBe(1_666_666n);
  });

  it("shows zero for losing side after resolution", () => {
    const pos = makeCpfPoolPosition({ balanceInFavor: "1000000", balanceAgainst: "0" });
    const state = makeCpfPoolState({
      state: "RESOLVED",
      winningOutcome: "AGAINST",
      totalWinningStake: "4000000",
      totalLosingStake: "6000000",
      resolvedAt: "1700100000",
    });
    const { open, claimable } = valuateCpf(pos, state);
    expect(open).toBe(0n);
    expect(claimable).toBe(0n);
  });

  it("treats pool as open when state is not RESOLVED even if winningOutcome is set", () => {
    // Regression: Envio may return a non-empty winningOutcome for unresolved pools.
    const pos = makeCpfPoolPosition({ balanceInFavor: "1000000", balanceAgainst: "0" });
    const state = makeCpfPoolState({ state: "OPEN", winningOutcome: "0" });
    const { open, claimable } = valuateCpf(pos, state);
    // Should be mark-to-market, not payout.
    expect(claimable).toBe(0n);
    expect(open).toBeGreaterThan(0n);
  });

  it("refunds stake in full when pool is voided", () => {
    const pos = makeCpfPoolPosition({ balanceInFavor: "1000000", claimed: false });
    const state = makeCpfPoolState({ state: "VOIDED", winningOutcome: "" });
    const { claimable } = valuateCpf(pos, state);
    expect(claimable).toBe(1_000_000n);
  });

  it("handles user who bet on both sides", () => {
    const pos = makeCpfPoolPosition({ balanceInFavor: "1000000", balanceAgainst: "500000" });
    const state = makeCpfPoolState({
      stakeInFavor: "6000000",
      stakeAgainst: "4000000",
      winningOutcome: "",
    });
    const { open } = valuateCpf(pos, state);
    // FOR mark = 600k, AGAINST mark = 500k × (4M/10M) = 200k → total 800k
    expect(open).toBe(800_000n);
  });
});

// ─── valuateTwoPool ──────────────────────────────────────────────────────────

describe("valuateTwoPool", () => {
  it("returns zero for undefined user", () => {
    const { locked, claimable } = valuateTwoPool(undefined, makeTwoPoolState());
    expect(locked).toBe(0n);
    expect(claimable).toBe(0n);
  });

  it("locks net deposited while OPEN", () => {
    const user = makeTwoPoolUser({ stableNetDeposited: "1000000", elevatedNetDeposited: "0" });
    const { locked, claimable } = valuateTwoPool(user, makeTwoPoolState({ state: "OPEN" }));
    expect(locked).toBe(1_000_000n);
    expect(claimable).toBe(0n);
  });

  it("computes YT entitlement after resolution", () => {
    // User deposited 1M of 5M stable TVL → 20% share of 2M allocation = 400k YT
    const user = makeTwoPoolUser({ stableNetDeposited: "1000000", stableClaimedYt: "0" });
    const state = makeTwoPoolState({
      state: "RESOLVED",
      sideTVLStable: "5000000",
      sideFinalAllocationStable: "2000000",
    });
    const { locked, claimable } = valuateTwoPool(user, state);
    expect(locked).toBe(0n);
    expect(claimable).toBe(400_000n);
  });

  it("subtracts already-claimed YT", () => {
    const user = makeTwoPoolUser({ stableNetDeposited: "1000000", stableClaimedYt: "200000" });
    const state = makeTwoPoolState({
      state: "RESOLVED",
      sideTVLStable: "5000000",
      sideFinalAllocationStable: "2000000",
    });
    const { claimable } = valuateTwoPool(user, state);
    expect(claimable).toBe(200_000n);
  });

  it("handles zero TVL without throwing", () => {
    const user = makeTwoPoolUser({ stableNetDeposited: "1000000" });
    const state = makeTwoPoolState({ state: "RESOLVED", sideTVLStable: "0", sideFinalAllocationStable: "2000000" });
    const { claimable } = valuateTwoPool(user, state);
    expect(claimable).toBe(0n);
  });
});

// ─── computeFreeYt ───────────────────────────────────────────────────────────

describe("computeFreeYt", () => {
  it("returns zero with no positions", () => {
    const result = computeFreeYt([], [], new Map(), [], new Map(), [], new Map());
    expect(result).toBe(0n);
  });

  it("returns total yield claimed minus locked amounts", () => {
    const vaultPos = makeUserPosition({ totalYieldClaimed: "3000000" });

    // CPF: 1M locked in open pool
    const cpfPos = makeCpfPoolPosition({ balanceInFavor: "1000000" });
    const cpfState = makeCpfPoolState({ winningOutcome: "" });
    const cpfMap = new Map([[POOL_ID, cpfState]]);

    // RYD: 500k locked in open round
    const rydPart = makeRydParticipant({ depositAmount: "500000" });
    const rydState = makeRydState({ state: "OPEN" });
    const rydMap = new Map([[RYD_ID, rydState]]);

    const free = computeFreeYt(
      [vaultPos],
      [cpfPos],
      cpfMap,
      [rydPart],
      rydMap,
      [],
      new Map(),
    );

    // 3M earned − 1M CPF − 500k RYD = 1.5M
    expect(free).toBe(1_500_000n);
  });

  it("clamps to 0 when freeYt would be negative (indexer lag)", () => {
    const vaultPos = makeUserPosition({ totalYieldClaimed: "100000" });
    const cpfPos = makeCpfPoolPosition({ balanceInFavor: "1000000" });
    const cpfMap = new Map([[POOL_ID, makeCpfPoolState({ winningOutcome: "" })]]);

    const free = computeFreeYt([vaultPos], [cpfPos], cpfMap, [], new Map(), [], new Map());
    expect(free).toBe(0n);
  });
});

// ─── computePortfolio ────────────────────────────────────────────────────────

describe("computePortfolio", () => {
  it("returns zero portfolio for null inputs", () => {
    const result = computePortfolio(null, null);
    expect(result.totalValueUsdc).toBe("0");
    expect(result.positions.vaults).toHaveLength(0);
  });

  it("assembles a full portfolio across all products", () => {
    const derived: UserDerivedStateResponse = {
      UserPosition: [makeUserPosition({ currentBalance: "5000000", totalYieldClaimed: "500000" })],
      RYDParticipant: [makeRydParticipant({ depositAmount: "2000000" })],
      RYDWinner: [],
      CPFPoolPosition: [makeCpfPoolPosition({ balanceInFavor: "1000000" })],
      TwoPoolUser: [makeTwoPoolUser({ stableNetDeposited: "1000000" })],
    };

    const global: GlobalStateResponse = {
      VaultState: [makeVaultState({ totalBalance: "10000000", totalYieldPaid: "1000000" })],
      VaultDailySnapshot: [],
      RYDState: [makeRydState({ state: "OPEN" })],
      CPFPoolState: [makeCpfPoolState()],
      TwoPoolState: [makeTwoPoolState()],
    };

    const result = computePortfolio(derived, global);

    // Vault principal = 5M
    expect(BigInt(result.breakdown.vaultPrincipal)).toBe(5_000_000n);
    // RYD locked = 2M
    expect(BigInt(result.breakdown.rydLocked)).toBe(2_000_000n);
    // TwoPool locked = 1M
    expect(BigInt(result.breakdown.twoPoolLocked)).toBe(1_000_000n);

    // Positions are populated
    expect(result.positions.vaults).toHaveLength(1);
    expect(result.positions.ryds).toHaveLength(1);
    expect(result.positions.cpfBets).toHaveLength(1);
    expect(result.positions.cpfBets[0]?.poolId).toBe(POOL_ID);
    expect(result.positions.twoPools).toHaveLength(1);

    // Total > 0
    expect(BigInt(result.totalValueUsdc)).toBeGreaterThan(0n);
  });

  it("emits numeric poolId on cpfBets when Envio pool_id is a composite entity id", () => {
    const derived: UserDerivedStateResponse = {
      UserPosition: [],
      RYDParticipant: [],
      RYDWinner: [],
      CPFPoolPosition: [makeCpfPoolPosition()],
      TwoPoolUser: [],
    };
    const global: GlobalStateResponse = {
      VaultState: [],
      VaultDailySnapshot: [],
      RYDState: [],
      CPFPoolState: [makeCpfPoolState()],
      TwoPoolState: [],
    };

    const result = computePortfolio(derived, global);
    expect(result.positions.cpfBets).toHaveLength(1);
    expect(result.positions.cpfBets[0]?.poolId).toBe("42");
    expect(result.positions.cpfBets[0]?.cpfAddress).toBe(CPF_ADDR);
  });
});
