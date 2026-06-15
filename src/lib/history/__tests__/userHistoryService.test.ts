/**
 * Integration tests for the userHistoryService orchestrator.
 *
 * All external I/O is stubbed via vi.mock:
 *   - @/lib/db          → Prisma client
 *   - @/shared/api/userHistoryEnvio → Envio fetch functions
 *
 * The pure mappers and chart helpers run for real (no mocking) so these tests
 * also exercise the full data pipeline end-to-end.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";

// ─── Stub Prisma ──────────────────────────────────────────────────────────────

const mockUpsert = vi.fn().mockResolvedValue({});
const mockFindUnique = vi.fn();
const mockFindFirst = vi.fn().mockResolvedValue(null);
const mockCount = vi.fn().mockResolvedValue(0);
const mockFindMany = vi.fn().mockResolvedValue([]);
const mockTransaction = vi.fn();

vi.mock("@/lib/db", () => ({
  db: {
    userHistoryCache: { findUnique: (...a: unknown[]) => mockFindUnique(...a) },
    userActivity: { upsert: (...a: unknown[]) => mockUpsert(...a), findMany: (...a: unknown[]) => mockFindMany(...a) },
    userPortfolioPoint: {
      upsert: (...a: unknown[]) => mockUpsert(...a),
      findMany: (...a: unknown[]) => mockFindMany(...a),
      findFirst: (...a: unknown[]) => mockFindFirst(...a),
      count: (...a: unknown[]) => mockCount(...a),
    },
    $transaction: (...a: unknown[]) => mockTransaction(...a),
  },
}));

// ─── Stub Envio ───────────────────────────────────────────────────────────────

const mockFetchEnvioHead = vi.fn();
const mockFetchAllUserEvents = vi.fn();
const mockFetchDerivedAndGlobalState = vi.fn();

vi.mock("@/shared/api/userHistoryEnvio", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/shared/api/userHistoryEnvio")>();
  return {
    ...original,
    fetchEnvioHead: (...a: unknown[]) => mockFetchEnvioHead(...a),
    fetchAllUserEvents: (...a: unknown[]) => mockFetchAllUserEvents(...a),
    fetchDerivedAndGlobalState: (...a: unknown[]) => mockFetchDerivedAndGlobalState(...a),
  };
});

// ─── Import SUT after mocks ───────────────────────────────────────────────────

import { getUserHistory } from "../userHistoryService";
import type { UserDeltaResponse } from "@/shared/types/envioRaw";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const ADDRESS = "0xAbCd1234AbCd1234AbCd1234AbCd1234AbCd1234";
const BLOCK_100 = 100;
const BLOCK_200 = 200;

const EMPTY_DELTA: UserDeltaResponse = {
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

const DELTA_WITH_ONE_DEPOSIT: UserDeltaResponse = {
  ...EMPTY_DELTA,
  PraxisVault_Deposit: [
    {
      id: `8453_${String(BLOCK_200).padStart(12, "0")}_00001`,
      vault: "0xvault0000000000000000000000000000000001",
      principal: "5000000",
      buyIn: "4900000",
      receiver: ADDRESS.toLowerCase(),
    },
  ],
};

function makeTransactionExecutor(
  activitiesOut = [] as unknown[],
  pointsOut = [] as unknown[],
) {
  return async (fn: (tx: unknown) => Promise<unknown>) => {
    const tx = {
      userActivity: {
        upsert: vi.fn().mockResolvedValue({}),
        createMany: vi.fn().mockResolvedValue({ count: 0 }),
      },
      userPortfolioPoint: { upsert: vi.fn().mockResolvedValue({}) },
      userHistoryCache: { upsert: vi.fn().mockResolvedValue({}) },
    };
    // Attach the read-back mocks last
    (tx as Record<string, unknown>).userActivity = {
      ...tx.userActivity,
      findMany: vi.fn().mockResolvedValue(activitiesOut),
    };
    (tx as Record<string, unknown>).userPortfolioPoint = {
      ...tx.userPortfolioPoint,
      findMany: vi.fn().mockResolvedValue(pointsOut),
    };
    return fn(tx);
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();
  // Default: no stale cache
  mockFindUnique.mockResolvedValue(null);
  mockFindFirst.mockResolvedValue(null);
  mockCount.mockResolvedValue(0);
  mockFetchDerivedAndGlobalState.mockResolvedValue({ derived: null, global: null });
});

describe("getUserHistory — cold start (no cache)", () => {
  it("returns cacheHit=false and empty activity/chart for a brand-new address", async () => {
    mockFetchEnvioHead.mockResolvedValue(BLOCK_100);
    mockFetchAllUserEvents.mockResolvedValue(EMPTY_DELTA);
    mockTransaction.mockImplementation(makeTransactionExecutor());

    const result = await getUserHistory(ADDRESS);

    // getUserHistory normalises via viem getAddress — checksum may differ from fixture
    expect(result.cacheHit).toBe(false);
    expect(result.userAddress.toLowerCase()).toBe(ADDRESS.toLowerCase());
    expect(result.syncedAtBlock).toBe(String(BLOCK_100));
    expect(result.activity).toEqual([]);
    expect(result.chart).toEqual([]);
    expect(result.portfolio.totalValueUsdc).toBe("0");
  });

  it("writes the cache row on cold start", async () => {
    mockFetchEnvioHead.mockResolvedValue(BLOCK_100);
    mockFetchAllUserEvents.mockResolvedValue(EMPTY_DELTA);
    mockTransaction.mockImplementation(makeTransactionExecutor());

    await getUserHistory(ADDRESS);

    // $transaction must have been called exactly once
    expect(mockTransaction).toHaveBeenCalledTimes(1);
  });
});

describe("getUserHistory — warm (same Envio head)", () => {
  it("returns cacheHit=true and makes no DB writes when head has not advanced", async () => {
    const cacheRow = {
      userAddress: ADDRESS,
      lastProcessedBlock: BigInt(BLOCK_100),
      envioBlockAtSync: BigInt(BLOCK_100),
      schemaVersion: 1,
      portfolioJson: { totalValueUsdc: "5000000" },
      touchedVaults: [],
      touchedRyds: [],
      touchedCpfPools: [],
      touchedTwoPools: [],
      updatedAt: new Date("2025-01-01"),
    };
    mockFindUnique.mockResolvedValue(cacheRow);
    mockFetchEnvioHead.mockResolvedValue(BLOCK_100);
    // findMany returns [] for activities and chart
    mockFindMany.mockResolvedValue([]);

    const result = await getUserHistory(ADDRESS);

    expect(result.cacheHit).toBe(true);
    // No write transaction should have been called
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  it("reads the most recent chart window (desc + reverse), not the oldest points", async () => {
    const cacheRow = {
      userAddress: ADDRESS,
      lastProcessedBlock: BigInt(BLOCK_100),
      envioBlockAtSync: BigInt(BLOCK_100),
      schemaVersion: 1,
      portfolioJson: { totalValueUsdc: "5000000" },
      touchedVaults: [],
      touchedRyds: [],
      touchedCpfPools: [],
      touchedTwoPools: [],
      updatedAt: new Date("2025-01-01"),
    };
    mockFindUnique.mockResolvedValue(cacheRow);
    mockFetchEnvioHead.mockResolvedValue(BLOCK_100);
    mockFindMany.mockResolvedValue([]);

    await getUserHistory(ADDRESS);

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { bucketTs: "desc" },
        take: 90,
      }),
    );
  });

  it("runs a repair sync when cache is warm but recent chart points are stale zero", async () => {
    const cacheRow = {
      userAddress: ADDRESS,
      lastProcessedBlock: BigInt(BLOCK_100),
      envioBlockAtSync: BigInt(BLOCK_100),
      schemaVersion: 1,
      portfolioJson: { totalValueUsdc: "5000000" },
      touchedVaults: ["0xvault0000000000000000000000000000000001"],
      touchedRyds: [],
      touchedCpfPools: [],
      touchedTwoPools: [],
      updatedAt: new Date("2025-01-01"),
    };
    mockFindUnique.mockResolvedValue(cacheRow);
    mockFetchEnvioHead.mockResolvedValue(BLOCK_100);
    mockCount.mockResolvedValue(89);
    mockFetchAllUserEvents.mockResolvedValue(EMPTY_DELTA);
    mockTransaction.mockImplementation(makeTransactionExecutor());

    const result = await getUserHistory(ADDRESS);

    expect(result.cacheHit).toBe(false);
    expect(mockTransaction).toHaveBeenCalledTimes(1);
  });
});

describe("getUserHistory — new blocks with one new event", () => {
  it("returns cacheHit=false and includes the new activity", async () => {
    const cacheRow = {
      userAddress: ADDRESS,
      lastProcessedBlock: BigInt(BLOCK_100),
      envioBlockAtSync: BigInt(BLOCK_100),
      schemaVersion: 1,
      portfolioJson: { totalValueUsdc: "0", lastBucketDate: "2025-01-01" },
      touchedVaults: [],
      touchedRyds: [],
      touchedCpfPools: [],
      touchedTwoPools: [],
      updatedAt: new Date("2025-01-01"),
    };
    mockFindUnique.mockResolvedValue(cacheRow);
    mockFetchEnvioHead.mockResolvedValue(BLOCK_200);
    mockFetchAllUserEvents.mockResolvedValue(DELTA_WITH_ONE_DEPOSIT);

    const activityRow = {
      id: `${String(BLOCK_200).padStart(12, "0")}_00001`,
      userAddress: ADDRESS,
      kind: "VAULT_DEPOSIT",
      productAddr: "0xvault0000000000000000000000000000000001",
      marketRef: "0xvault0000000000000000000000000000000001",
      amountDelta: "5000000",
      blockNumber: BigInt(BLOCK_200),
      blockTime: BigInt(1691539200 + BLOCK_200 * 2),
      metadataJson: {},
    };

    mockTransaction.mockImplementation(
      makeTransactionExecutor([activityRow], []),
    );

    const result = await getUserHistory(ADDRESS);

    expect(result.cacheHit).toBe(false);
    expect(result.activity).toHaveLength(1);
    expect(result.activity[0]!.kind).toBe("VAULT_DEPOSIT");
    expect(mockTransaction).toHaveBeenCalledTimes(1);
  });

  it("fetches derived/global state with market IDs discovered in Q1 on the same sync", async () => {
    mockFetchEnvioHead.mockResolvedValue(BLOCK_100);
    mockFetchAllUserEvents.mockResolvedValue(DELTA_WITH_ONE_DEPOSIT);
    mockTransaction.mockImplementation(makeTransactionExecutor());

    await getUserHistory(ADDRESS);

    expect(mockFetchDerivedAndGlobalState).toHaveBeenCalledWith(
      ADDRESS.toLowerCase(),
      {
        vaultIds: ["0xvault0000000000000000000000000000000001"],
        rydIds: [],
        cpfPoolIds: [],
        twoPoolIds: [],
      },
    );
  });
});

describe("getUserHistory — Envio downtime with existing cache", () => {
  it("returns stale cache (HTTP 200 with stale field) when Envio throws", async () => {
    const cacheRow = {
      userAddress: ADDRESS,
      lastProcessedBlock: BigInt(BLOCK_100),
      envioBlockAtSync: BigInt(BLOCK_100),
      schemaVersion: 1,
      portfolioJson: { totalValueUsdc: "3000000" },
      touchedVaults: [],
      touchedRyds: [],
      touchedCpfPools: [],
      touchedTwoPools: [],
      updatedAt: new Date("2025-01-01"),
    };
    mockFindUnique.mockResolvedValue(cacheRow);
    mockFetchEnvioHead.mockRejectedValue(new Error("Envio unreachable"));
    mockFindMany.mockResolvedValue([]);

    const result = await getUserHistory(ADDRESS);

    expect(result.cacheHit).toBe(true);
    expect(result.stale).toBeDefined();
    expect(result.stale?.syncedAtBlock).toBe(String(BLOCK_100));
    // No writes
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  it("throws when Envio is down AND there is no cache", async () => {
    mockFindUnique.mockResolvedValue(null);
    mockFetchEnvioHead.mockRejectedValue(new Error("Envio unreachable"));

    await expect(getUserHistory(ADDRESS)).rejects.toThrow("Envio unreachable");
  });
});

describe("getUserHistory — schema version mismatch", () => {
  it("forces a full recompute when cache schemaVersion is stale", async () => {
    const staleCache = {
      userAddress: ADDRESS,
      lastProcessedBlock: BigInt(BLOCK_100),
      envioBlockAtSync: BigInt(BLOCK_100),
      schemaVersion: 0,         // stale — current is 1
      portfolioJson: {},
      touchedVaults: [],
      touchedRyds: [],
      touchedCpfPools: [],
      touchedTwoPools: [],
      updatedAt: new Date("2025-01-01"),
    };
    mockFindUnique.mockResolvedValue(staleCache);
    mockFetchEnvioHead.mockResolvedValue(BLOCK_100);
    mockFetchAllUserEvents.mockResolvedValue(EMPTY_DELTA);
    mockTransaction.mockImplementation(makeTransactionExecutor());

    const result = await getUserHistory(ADDRESS);

    // Must have gone through the full sync path
    expect(mockFetchAllUserEvents).toHaveBeenCalled();
    expect(mockTransaction).toHaveBeenCalledTimes(1);
    expect(result.cacheHit).toBe(false);
  });
});

describe("getUserHistory — concurrent requests for the same address", () => {
  it("deduplicates in-flight requests", async () => {
    mockFetchEnvioHead.mockResolvedValue(BLOCK_100);
    mockFetchAllUserEvents.mockResolvedValue(EMPTY_DELTA);
    mockTransaction.mockImplementation(makeTransactionExecutor());

    // Fire two requests concurrently — only one Envio call should be made
    const [r1, r2] = await Promise.all([
      getUserHistory(ADDRESS),
      getUserHistory(ADDRESS),
    ]);

    expect(mockFetchEnvioHead).toHaveBeenCalledTimes(1);
    expect(r1.syncedAtBlock).toBe(r2.syncedAtBlock);
  });
});
