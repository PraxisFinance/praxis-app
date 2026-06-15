import { describe, it, expect, vi } from "vitest";
import {
  cpfMarketRefKey,
  extractCpfPoolRef,
  fetchActivityTitleContext,
} from "../activityTitleEnrichment";

describe("extractCpfPoolRef", () => {
  it("reads cpf + poolId from metadata", () => {
    expect(
      extractCpfPoolRef({
        kind: "CPF_BET",
        productAddr: "0xCpf",
        marketRef: "0xcpf_42",
        metadataJson: { cpf: "0xCpf", poolId: "42", side: "FOR" },
      }),
    ).toEqual({ cpfAddress: "0xcpf", poolId: "42" });
  });
});

describe("fetchActivityTitleContext", () => {
  it("loads Event.title and TwoPoolContract.name", async () => {
    const cpf = "0xcpf0000000000000000000000000000000001";
    const pool = "0xpool0000000000000000000000000000000001";

    const ctx = await fetchActivityTitleContext(
      {
        event: {
          findMany: vi.fn().mockResolvedValue([
            {
              cpfAddress: cpf,
              contractEventId: "7",
              title: "Election outcome",
            },
          ]),
        },
        twoPoolContract: {
          findMany: vi.fn().mockResolvedValue([
            { address: pool, name: "March Pool" },
          ]),
        },
      },
      [
        {
          kind: "CPF_BET",
          productAddr: cpf,
          marketRef: `${cpf}_7`,
          metadataJson: { cpf, poolId: "7", side: "AGAINST" },
        },
        {
          kind: "TWOPOOL_DEPOSIT",
          productAddr: pool,
          marketRef: pool,
          metadataJson: { pool, side: "STABLE" },
        },
      ],
    );

    expect(ctx.cpfEventTitleByMarketRef.get(cpfMarketRefKey(cpf, "7"))).toBe(
      "Election outcome",
    );
    expect(ctx.twoPoolNameByAddress.get(pool.toLowerCase())).toBe("March Pool");
  });
});
