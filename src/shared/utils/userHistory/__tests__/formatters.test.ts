import { describe, it, expect } from "vitest";
import { formatActivityTitle } from "../formatters";

describe("formatActivityTitle", () => {
  it("formats CPF bet as Event.title + side", () => {
    expect(
      formatActivityTitle(
        "CPF_BET",
        { side: "FOR" },
        { cpfEventTitle: "Will ETH hit $5k?" },
      ),
    ).toBe("Will ETH hit $5k? - For");
  });

  it("formats RYD activities as Random Yield Distribution", () => {
    expect(formatActivityTitle("RYD_DEPOSIT", { ryd: "0xryd" })).toBe(
      "Random Yield Distribution",
    );
    expect(formatActivityTitle("RYD_CLAIM", {})).toBe("Random Yield Distribution");
  });

  it("formats TwoPool deposit as contract name + side", () => {
    expect(
      formatActivityTitle(
        "TWOPOOL_DEPOSIT",
        { side: "ELEVATED", pool: "0xpool1" },
        { twoPoolName: "USDC Elevated Pool" },
      ),
    ).toBe("USDC Elevated Pool - Elevated");
  });

  it("formats TwoPool stable side from metadata", () => {
    expect(
      formatActivityTitle(
        "TWOPOOL_CLAIM",
        { side: "STABLE", pool: "0xpool1" },
        { twoPoolName: "Core Stable Pool" },
      ),
    ).toBe("Core Stable Pool - Stable");
  });
});
