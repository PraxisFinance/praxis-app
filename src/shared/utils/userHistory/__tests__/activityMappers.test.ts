import { describe, it, expect } from "vitest";
import {
  mapVaultDepositActivity,
  mapVaultWithdrawActivity,
  mapVaultRedeemActivity,
  mapRydDepositActivity,
  mapRydWithdrawActivity,
  mapRydClaimActivity,
  mapCpfBetActivity,
  mapCpfCancelActivity,
  mapCpfClaimActivity,
  mapCpfWithdrawActivity,
  mapTwoPoolDepositActivity,
  mapTwoPoolClaimActivity,
  mapAllDeltaToActivities,
} from "../activityMappers";
import type { UserDeltaResponse } from "@/shared/types/envioRaw";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const USER = "0xAbCd1234AbCd1234AbCd1234AbCd1234AbCd1234";
const VAULT = "0xvault000000000000000000000000000000001";
const RYD = "0xryd0000000000000000000000000000000001";
const CPF = "0xcpf0000000000000000000000000000000001";
const POOL = "0xpool000000000000000000000000000000001";

// Block 1_000_000, logIndex 5 → id = "84532_000001000000_00005"
// Chain 84532 = Base Sepolia (APP_CHAIN_ID used by envioIdToActivityId).
const mkId = (block: number, logIndex: number) =>
  `84532_${String(block).padStart(12, "0")}_${String(logIndex).padStart(5, "0")}`;

const strippedId = (block: number, logIndex: number) =>
  `${String(block).padStart(12, "0")}_${String(logIndex).padStart(5, "0")}`;

// ─── Vault ────────────────────────────────────────────────────────────────────

describe("mapVaultDepositActivity", () => {
  it("maps a deposit correctly", () => {
    const raw = { id: mkId(1_000_000, 5), timestamp: "1700000000", vault: VAULT, principal: "5000000", buyIn: "4950000", receiver: USER };
    const rec = mapVaultDepositActivity(raw, USER);

    expect(rec.id).toBe(strippedId(1_000_000, 5));
    expect(rec.kind).toBe("VAULT_DEPOSIT");
    expect(rec.productAddr).toBe(VAULT);
    expect(rec.amountDelta).toBe("5000000");
    expect(rec.metadataJson).toMatchObject({ principal: "5000000", buyIn: "4950000" });
  });

  it("uses the real block timestamp from the Envio indexer", () => {
    const raw = { id: mkId(10, 0), timestamp: "1691539220", vault: VAULT, principal: "1", buyIn: "1", receiver: USER };
    const rec = mapVaultDepositActivity(raw, USER);

    expect(rec.blockNumber).toBe(10n);
    expect(rec.blockTime).toBe(1691539220n);
  });
});

describe("mapVaultWithdrawActivity", () => {
  it("records withdrawal as negative amountDelta", () => {
    const raw = { id: mkId(2_000_000, 0), timestamp: "1700002000", vault: VAULT, amount: "5100000", yieldPayout: "100000", receiver: USER };
    const rec = mapVaultWithdrawActivity(raw, USER);

    expect(rec.kind).toBe("VAULT_WITHDRAW");
    expect(rec.amountDelta).toBe("-5100000");
    expect(rec.metadataJson).toMatchObject({ yieldPayout: "100000" });
  });
});

describe("mapVaultRedeemActivity", () => {
  it("records yield redemption as positive amountDelta", () => {
    const raw = { id: mkId(3_000_000, 1), timestamp: "1700003000", vault: VAULT, ytBurn: "200000", payout: "200000", receiver: USER };
    const rec = mapVaultRedeemActivity(raw, USER);

    expect(rec.kind).toBe("VAULT_REDEEM_YIELD");
    expect(rec.amountDelta).toBe("200000");
  });
});

// ─── RYD ─────────────────────────────────────────────────────────────────────

describe("mapRydDepositActivity", () => {
  it("records deposit as negative (YT locked)", () => {
    const raw = { id: mkId(1_000_000, 0), timestamp: "1700001000", ryd: RYD, user: USER, amount: "1000000" };
    const rec = mapRydDepositActivity(raw, USER);

    expect(rec.kind).toBe("RYD_DEPOSIT");
    expect(rec.amountDelta).toBe("-1000000");
    expect(rec.marketRef).toBe(RYD);
  });
});

describe("mapRydWithdrawActivity", () => {
  it("records withdrawal as positive", () => {
    const raw = { id: mkId(1_000_001, 0), timestamp: "1700001002", ryd: RYD, user: USER, amount: "1000000" };
    const rec = mapRydWithdrawActivity(raw, USER);

    expect(rec.kind).toBe("RYD_WITHDRAW");
    expect(rec.amountDelta).toBe("1000000");
  });
});

describe("mapRydClaimActivity", () => {
  it("records prize claim as positive", () => {
    const raw = { id: mkId(2_000_000, 0), timestamp: "1700002000", ryd: RYD, winner: USER, amount: "500000" };
    const rec = mapRydClaimActivity(raw, USER);

    expect(rec.kind).toBe("RYD_CLAIM");
    expect(rec.amountDelta).toBe("500000");
  });
});

// ─── CPF ─────────────────────────────────────────────────────────────────────

describe("mapCpfBetActivity", () => {
  it("records FOR-side bet as negative", () => {
    const raw = { id: mkId(1_000_000, 0), timestamp: "1700001000", cpf: CPF, poolId: "42", user: USER, amount: "1000000", inFavor: true };
    const rec = mapCpfBetActivity(raw, USER);

    expect(rec.kind).toBe("CPF_BET");
    expect(rec.amountDelta).toBe("-1000000");
    expect(rec.marketRef).toBe(`${CPF}_42`);
    expect(rec.metadataJson).toMatchObject({ side: "FOR" });
  });

  it("records AGAINST-side bet as negative", () => {
    const raw = { id: mkId(1_000_001, 0), timestamp: "1700001002", cpf: CPF, poolId: "42", user: USER, amount: "500000", inFavor: false };
    const rec = mapCpfBetActivity(raw, USER);

    expect(rec.metadataJson).toMatchObject({ side: "AGAINST" });
  });
});

describe("mapCpfCancelActivity", () => {
  it("records cancellation with zero amountDelta (on-chain refund amount not available)", () => {
    const raw = { id: mkId(1_000_002, 0), timestamp: "1700001004", cpf: CPF, user: USER, poolId: "42" };
    const rec = mapCpfCancelActivity(raw, USER);

    expect(rec.kind).toBe("CPF_CANCEL");
    expect(rec.amountDelta).toBe("0");
    expect(rec.marketRef).toBe(`${CPF}_42`);
  });
});

describe("mapCpfClaimActivity", () => {
  it("records reward claim as positive", () => {
    const raw = { id: mkId(2_000_000, 0), timestamp: "1700002000", cpf: CPF, poolId: "42", user: USER, payout: "1800000" };
    const rec = mapCpfClaimActivity(raw, USER);

    expect(rec.kind).toBe("CPF_CLAIM");
    expect(rec.amountDelta).toBe("1800000");
  });
});

describe("mapCpfWithdrawActivity", () => {
  it("records withdraw as positive with no marketRef", () => {
    const raw = { id: mkId(2_000_001, 0), timestamp: "1700002002", cpf: CPF, user: USER, amount: "900000" };
    const rec = mapCpfWithdrawActivity(raw, USER);

    expect(rec.kind).toBe("CPF_WITHDRAW");
    expect(rec.amountDelta).toBe("900000");
    expect(rec.marketRef).toBeNull();
  });
});

// ─── TwoPool ─────────────────────────────────────────────────────────────────

describe("mapTwoPoolDepositActivity", () => {
  it("converts side=0 to STABLE and records as negative", () => {
    const raw = { id: mkId(1_000_000, 0), timestamp: "1700001000", pool: POOL, user: USER, side: 0, grossAmount: "1020000", fee: "20000", netAmount: "1000000" };
    const rec = mapTwoPoolDepositActivity(raw, USER);

    expect(rec.kind).toBe("TWOPOOL_DEPOSIT");
    expect(rec.amountDelta).toBe("-1000000");
    expect(rec.metadataJson).toMatchObject({ side: "STABLE" });
  });

  it("converts side=1 to ELEVATED", () => {
    const raw = { id: mkId(1_000_001, 0), timestamp: "1700001002", pool: POOL, user: USER, side: 1, grossAmount: "2000000", fee: "40000", netAmount: "1960000" };
    const rec = mapTwoPoolDepositActivity(raw, USER);

    expect(rec.metadataJson).toMatchObject({ side: "ELEVATED" });
  });
});

describe("mapTwoPoolClaimActivity", () => {
  it("records YT claim with zero USDC amountDelta", () => {
    const raw = { id: mkId(3_000_000, 0), timestamp: "1700003000", pool: POOL, user: USER, side: 0, ytOut: "300000" };
    const rec = mapTwoPoolClaimActivity(raw, USER);

    expect(rec.kind).toBe("TWOPOOL_CLAIM");
    expect(rec.amountDelta).toBe("0");
    expect(rec.metadataJson).toMatchObject({ side: "STABLE", ytOut: "300000" });
  });
});

// ─── Batch helper ────────────────────────────────────────────────────────────

describe("mapAllDeltaToActivities", () => {
  const emptyDelta: UserDeltaResponse = {
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

  it("returns empty array for a cold-start user", () => {
    expect(mapAllDeltaToActivities(emptyDelta, USER)).toEqual([]);
  });

  it("merges and sorts all products newest-first by blockTime", () => {
    const delta: UserDeltaResponse = {
      ...emptyDelta,
      PraxisVault_Deposit: [
        { id: mkId(500_000, 0), timestamp: "1700000500", vault: VAULT, principal: "1000000", buyIn: "990000", receiver: USER },
      ],
      PraxisCPF_PlaceBet: [
        { id: mkId(1_000_000, 0), timestamp: "1700001000", cpf: CPF, poolId: "1", user: USER, amount: "500000", inFavor: true },
      ],
      PraxisRYD_Deposited: [
        { id: mkId(750_000, 0), timestamp: "1700000750", ryd: RYD, user: USER, amount: "200000" },
      ],
    };

    const rows = mapAllDeltaToActivities(delta, USER);
    expect(rows).toHaveLength(3);
    // Newest first: block 1_000_000 > 750_000 > 500_000
    expect(rows.map((row) => row.kind)).toEqual(["CPF_BET", "RYD_DEPOSIT", "VAULT_DEPOSIT"]);
  });
});

// ─── id stripping ────────────────────────────────────────────────────────────

describe("chain prefix stripping", () => {
  it("strips the 8453_ prefix from all mapper outputs", () => {
    const raw = { id: mkId(1, 0), timestamp: "1700000001", vault: VAULT, principal: "1", buyIn: "1", receiver: USER };
    const rec = mapVaultDepositActivity(raw, USER);
    expect(rec.id).not.toContain("8453_");
    expect(rec.id).toMatch(/^\d+_\d+$/);
  });
});
