import type { HistoryResponse } from "@/shared/types/history";
import type { Claim } from "@/stores/claimsStore";

/**
 * Derive pending reward claims from historic portfolio positions.
 * Includes CPF winnings, RYD prizes, and TwoPool YT — excludes vault yield.
 */
export function deriveClaimsFromHistory(data: HistoryResponse): Claim[] {
  const claims: Claim[] = [];
  const { cpfBets, ryds, twoPools } = data.portfolio.positions;

  for (const p of cpfBets) {
    const claimable = BigInt(p.claimable);
    if (claimable <= 0n) continue;
    claims.push({
      id: `cpf-${p.cpfAddress}-${p.poolId}-${p.side}`,
      eventId: `cpf:${p.cpfAddress}:${p.poolId}:${p.side}`,
      income: claimable,
      status: "pending",
    });
  }

  for (const p of ryds) {
    if (!p.isWinner || p.claimed) continue;
    const prize = BigInt(p.prize);
    if (prize <= 0n) continue;
    claims.push({
      id: `ryd-${p.rydId}`,
      eventId: `ryd:${p.rydId}`,
      income: prize,
      status: "pending",
    });
  }

  for (const p of twoPools) {
    const ytClaimable = BigInt(p.ytClaimable);
    if (ytClaimable <= 0n) continue;
    claims.push({
      id: `twopool-${p.poolId}-${p.side}`,
      eventId: `twopool:${p.poolId}:${p.side}`,
      income: ytClaimable,
      status: "pending",
    });
  }

  return claims;
}
