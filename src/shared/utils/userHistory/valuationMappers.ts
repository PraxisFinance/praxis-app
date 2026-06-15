/**
 * Pure valuation functions for the history portfolio.
 *
 * All values are USDC at 6 decimal places as bigint.
 * All functions are pure — no I/O, no side effects.
 *
 * Deviations from plan 06 noted inline:
 *   - Vault userShare: plan uses totalBuyInCost/VaultState.totalBuyInCost but that field
 *     is absent from the Q3 schema; using currentBalance/totalBalance as a proxy.
 *   - CPF fee: plan uses feeBps but CPFPoolState.feeBps is not in the Q3 schema;
 *     fee deduction is omitted (payout is slightly overstated).
 */

import type {
  RawUserPosition,
  RawRYDParticipant,
  RawRYDWinner,
  RawCPFPoolPosition,
  RawCPFPoolState,
  RawTwoPoolUser,
  RawTwoPoolHistoryState,
  RawVaultState,
  RawRYDState,
  UserDerivedStateResponse,
  GlobalStateResponse,
} from "@/shared/types/envioRaw";
import type {
  PortfolioBreakdown,
  VaultPosition,
  RydPosition,
  CpfPosition,
  TwoPoolPosition,
} from "@/shared/types/history";

// ─── BigInt helpers ───────────────────────────────────────────────────────────

/** Safe multiply-then-divide for BigInt: (a × b) / c. Returns 0 when c = 0. */
function mulDiv(a: bigint, b: bigint, c: bigint): bigint {
  if (c === 0n) return 0n;
  return (a * b) / c;
}

function toBig(v: string | number | null | undefined): bigint {
  if (v == null) return 0n;
  return BigInt(v);
}

function maxBig(a: bigint, b: bigint): bigint {
  return a > b ? a : b;
}

// ─── Vault ───────────────────────────────────────────────────────────────────

/**
 * Compute a user's vault principal and claimable yield.
 *
 * userShare = currentBalance / totalBalance  (proxy for totalBuyInCost share)
 * claimableYield = max(0, totalYieldPaid × userShare − totalYieldClaimed)
 */
export function valuateVault(
  position: RawUserPosition | undefined,
  vaultState: RawVaultState,
): { principal: bigint; claimableYield: bigint } {
  if (!position) return { principal: 0n, claimableYield: 0n };

  const principal = toBig(position.currentBalance);
  const totalBalance = toBig(vaultState.totalBalance);
  const totalYieldPaid = toBig(vaultState.totalYieldPaid);
  const totalYieldClaimed = toBig(position.totalYieldClaimed);

  const userYieldEntitlement =
    totalBalance > 0n ? mulDiv(totalYieldPaid, principal, totalBalance) : 0n;

  const claimableYield = maxBig(0n, userYieldEntitlement - totalYieldClaimed);
  return { principal, claimableYield };
}

// ─── RYD ─────────────────────────────────────────────────────────────────────

/**
 * Compute a user's RYD locked amount and claimable prize.
 * Uses RYDParticipant as the primary source; RYDWinner provides confirmation.
 */
export function valuateRyd(
  participant: RawRYDParticipant | undefined,
  _winner: RawRYDWinner | undefined,
  rydState: RawRYDState,
): { locked: bigint; claimable: bigint } {
  if (!participant) return { locked: 0n, claimable: 0n };

  const isClosed = rydState.state.toUpperCase() === "CLOSED";

  if (!isClosed) {
    // OPEN or DRAWING: principal is still locked
    return { locked: toBig(participant.depositAmount), claimable: 0n };
  }

  // CLOSED: winner gets prize, loser gets nothing
  if (participant.isWinner && !participant.hasClaimed) {
    return { locked: 0n, claimable: toBig(participant.prizeAmount) };
  }

  return { locked: 0n, claimable: 0n };
}

// ─── CPF ─────────────────────────────────────────────────────────────────────

type CpfSideValuation = { open: bigint; claimable: bigint };

/**
 * Compute mark-to-market or claimable value for one stake-side of a CPF position.
 * @param stake      User's stake on this side (balanceInFavor or balanceAgainst).
 * @param isForSide  true = FOR side, false = AGAINST side.
 */
function valuateCpfSide(
  stake: bigint,
  isForSide: boolean,
  position: RawCPFPoolPosition,
  poolState: RawCPFPoolState,
): CpfSideValuation {
  if (stake === 0n) return { open: 0n, claimable: 0n };

  const stateUpper = poolState.state.toUpperCase();

  // Voided or cancelled: full refund of stake
  if (stateUpper.includes("VOID") || stateUpper.includes("CANCEL")) {
    return position.claimed
      ? { open: 0n, claimable: 0n }
      : { open: 0n, claimable: stake };
  }

  // Resolved: pay out winners proportionally.
  // Gate on state field, not winningOutcome, because Envio may return a non-empty
  // winningOutcome default ("0") even for pools that have not settled yet.
  // Outcome encoding: "0" / "FOR" / "YES" / "TRUE" = FOR won;
  //                   "1" / "AGAINST" / "NO" / "FALSE" = AGAINST won.
  if (stateUpper === "RESOLVED") {
    const outcome = poolState.winningOutcome.toUpperCase();
    const forWon =
      outcome === "FOR" || outcome === "YES" || outcome === "TRUE" || outcome === "0";
    const userWon = isForSide ? forWon : !forWon;

    if (!userWon) return { open: 0n, claimable: 0n };

    const totalWinning = toBig(poolState.totalWinningStake);
    const totalPool = toBig(poolState.totalWinningStake) + toBig(poolState.totalLosingStake);
    if (totalWinning === 0n) return { open: 0n, claimable: 0n };

    // payout = stake / totalWinningStake × totalPool  (no feeBps — not in schema)
    const payout = mulDiv(stake, totalPool, totalWinning);
    return position.claimed
      ? { open: 0n, claimable: 0n }
      : { open: 0n, claimable: payout };
  }

  // Open pool: mark-to-market
  const stakeFor = toBig(poolState.stakeInFavor);
  const stakeAgainst = toBig(poolState.stakeAgainst);
  const poolTotal = stakeFor + stakeAgainst;

  if (poolTotal === 0n) return { open: stake, claimable: 0n };

  const poolSideStake = isForSide ? stakeFor : stakeAgainst;
  const markValue = mulDiv(stake, poolSideStake, poolTotal);
  // Safety cap: mark value ≤ 2× user stake
  const capped = markValue > stake * 2n ? stake * 2n : markValue;
  return { open: capped, claimable: 0n };
}

/**
 * Compute aggregate open + claimable across both FOR and AGAINST sides.
 */
export function valuateCpf(
  position: RawCPFPoolPosition | undefined,
  poolState: RawCPFPoolState,
): { open: bigint; claimable: bigint } {
  if (!position) return { open: 0n, claimable: 0n };

  const forResult = valuateCpfSide(toBig(position.balanceInFavor), true, position, poolState);
  const againstResult = valuateCpfSide(
    toBig(position.balanceAgainst),
    false,
    position,
    poolState,
  );

  return {
    open: forResult.open + againstResult.open,
    claimable: forResult.claimable + againstResult.claimable,
  };
}

// ─── TwoPool ─────────────────────────────────────────────────────────────────

/**
 * Compute a user's TwoPool locked principal and claimable YT entitlement (1 YT = 1 USDC in v1).
 */
export function valuateTwoPool(
  user: RawTwoPoolUser | undefined,
  poolState: RawTwoPoolHistoryState,
): { locked: bigint; claimable: bigint } {
  if (!user) return { locked: 0n, claimable: 0n };

  const isResolved =
    poolState.state.toUpperCase() === "RESOLVED" ||
    toBig(poolState.sideFinalAllocationStable) > 0n ||
    toBig(poolState.sideFinalAllocationElevated) > 0n;

  if (!isResolved) {
    const locked = toBig(user.stableNetDeposited) + toBig(user.elevatedNetDeposited);
    return { locked, claimable: 0n };
  }

  // Resolved: compute YT entitlement for each side
  const tvlStable = toBig(poolState.sideTVLStable);
  const tvlElevated = toBig(poolState.sideTVLElevated);
  const allocStable = toBig(poolState.sideFinalAllocationStable);
  const allocElevated = toBig(poolState.sideFinalAllocationElevated);

  const ytEntitleStable =
    tvlStable > 0n ? mulDiv(allocStable, toBig(user.stableNetDeposited), tvlStable) : 0n;
  const ytEntitleElevated =
    tvlElevated > 0n
      ? mulDiv(allocElevated, toBig(user.elevatedNetDeposited), tvlElevated)
      : 0n;

  const ytClaimableStable = maxBig(
    0n,
    ytEntitleStable - toBig(user.stableClaimedYt),
  );
  const ytClaimableElevated = maxBig(
    0n,
    ytEntitleElevated - toBig(user.elevatedClaimedYt),
  );

  // 1 YT = 1 USDC in v1
  return { locked: 0n, claimable: ytClaimableStable + ytClaimableElevated };
}

// ─── Free YT ─────────────────────────────────────────────────────────────────

/**
 * YT earned from vaults that is not currently locked in any active product.
 * Clamps to 0 if negative (indexer lag or rounding).
 */
export function computeFreeYt(
  vaultPositions: RawUserPosition[],
  cpfPositions: RawCPFPoolPosition[],
  cpfStates: Map<string, RawCPFPoolState>,
  rydParticipants: RawRYDParticipant[],
  rydStates: Map<string, RawRYDState>,
  twoPoolUsers: RawTwoPoolUser[],
  twoPoolStates: Map<string, RawTwoPoolHistoryState>,
): bigint {
  const ytFromVault = vaultPositions.reduce(
    (sum, p) => sum + toBig(p.totalYieldClaimed),
    0n,
  );

  // YT locked in open CPF pools
  const ytSpentInCpf = cpfPositions.reduce((sum, pos) => {
    const state = cpfStates.get(pos.pool_id);
    const stUp = state?.state.toUpperCase() ?? "";
    const isOpen =
      !state ||
      (stUp !== "RESOLVED" &&
        !stUp.includes("VOID") &&
        !stUp.includes("CANCEL"));
    if (!isOpen) return sum;
    return sum + toBig(pos.balanceInFavor) + toBig(pos.balanceAgainst);
  }, 0n);

  // YT locked in open RYD rounds
  const ytSpentInRyd = rydParticipants.reduce((sum, p) => {
    const state = rydStates.get(p.ryd_id);
    const isOpen = !state || state.state.toUpperCase() !== "CLOSED";
    return isOpen ? sum + toBig(p.depositAmount) : sum;
  }, 0n);

  // YT locked in open TwoPool tranches
  const ytSpentInPool = twoPoolUsers.reduce((sum, u) => {
    const state = twoPoolStates.get(u.pool_id);
    const isOpen =
      !state ||
      (toBig(state.sideFinalAllocationStable) === 0n &&
        toBig(state.sideFinalAllocationElevated) === 0n);
    if (!isOpen) return sum;
    return sum + toBig(u.stableNetDeposited) + toBig(u.elevatedNetDeposited);
  }, 0n);

  const freeYt = ytFromVault - ytSpentInCpf - ytSpentInRyd - ytSpentInPool;
  if (freeYt < 0n) {
    console.warn(
      JSON.stringify({ service: "userHistory", phase: "freeYt-negative", freeYt: String(freeYt) }),
    );
  }
  return maxBig(0n, freeYt);
}

// ─── Portfolio assembly ───────────────────────────────────────────────────────

type PortfolioResult = {
  totalValueUsdc: string;
  breakdown: PortfolioBreakdown;
  positions: {
    vaults: VaultPosition[];
    ryds: RydPosition[];
    cpfBets: CpfPosition[];
    twoPools: TwoPoolPosition[];
  };
};

const ZERO_PORTFOLIO: PortfolioResult = {
  totalValueUsdc: "0",
  breakdown: {
    vaultPrincipal: "0",
    vaultClaimableYield: "0",
    freeYt: "0",
    cpfOpen: "0",
    cpfClaimable: "0",
    rydLocked: "0",
    rydClaimable: "0",
    twoPoolLocked: "0",
    twoPoolClaimable: "0",
  },
  positions: { vaults: [], ryds: [], cpfBets: [], twoPools: [] },
};

/**
 * Compute the full portfolio from Envio derived + global state.
 * Returns zero portfolio when either input is null (cold-start or Envio down).
 */
export function computePortfolio(
  derived: UserDerivedStateResponse | null,
  global: GlobalStateResponse | null,
): PortfolioResult {
  if (!derived || !global) return ZERO_PORTFOLIO;

  // ── Build lookup maps ────────────────────────────────────────────────────
  const vaultStateMap = new Map(global.VaultState.map((s) => [s.id, s]));
  const rydStateMap = new Map(global.RYDState.map((s) => [s.id, s]));
  const cpfStateMap = new Map(global.CPFPoolState.map((s) => [s.id, s]));
  const twoPoolStateMap = new Map(global.TwoPoolState.map((s) => [s.id, s]));

  const winnerByRyd = new Map<string, RawRYDWinner>();
  for (const w of derived.RYDWinner) {
    winnerByRyd.set(w.ryd_id, w);
  }

  // ── Vaults ───────────────────────────────────────────────────────────────
  let vaultPrincipal = 0n;
  let vaultClaimableYield = 0n;
  const vaultPositions: VaultPosition[] = [];

  for (const pos of derived.UserPosition) {
    const state = vaultStateMap.get(pos.vault_id);
    if (!state) continue;
    const { principal, claimableYield } = valuateVault(pos, state);
    vaultPrincipal += principal;
    vaultClaimableYield += claimableYield;
    vaultPositions.push({
      vaultId: pos.vault_id,
      balance: pos.currentBalance,
      ytClaimable: String(claimableYield),
      maturity: state.maturity,
    });
  }

  // ── RYDs ─────────────────────────────────────────────────────────────────
  let rydLocked = 0n;
  let rydClaimable = 0n;
  const rydPositions: RydPosition[] = [];

  for (const p of derived.RYDParticipant) {
    const state = rydStateMap.get(p.ryd_id);
    if (!state) continue;
    const winner = winnerByRyd.get(p.ryd_id);
    const { locked, claimable } = valuateRyd(p, winner, state);
    rydLocked += locked;
    rydClaimable += claimable;
    rydPositions.push({
      rydId: p.ryd_id,
      state: state.state,
      deposit: p.depositAmount,
      isWinner: p.isWinner,
      prize: p.prizeAmount,
      claimed: p.hasClaimed,
    });
  }

  // ── CPF ──────────────────────────────────────────────────────────────────
  let cpfOpen = 0n;
  let cpfClaimable = 0n;
  const cpfBets: CpfPosition[] = [];

  for (const pos of derived.CPFPoolPosition) {
    const state = cpfStateMap.get(pos.pool_id);
    if (!state) continue;

    const { open, claimable } = valuateCpf(pos, state);
    cpfOpen += open;
    cpfClaimable += claimable;

    // Emit separate entries for FOR and AGAINST if both sides have balance
    const balFor = toBig(pos.balanceInFavor);
    const balAgainst = toBig(pos.balanceAgainst);

    const isResolved = state.state.toUpperCase() === "RESOLVED";
    // Envio CPFPoolPosition.pool_id is the entity id `${cpf}_${numericPoolId}`; API uses numeric poolId.
    const numericPoolId = state.poolId;

    if (balFor > 0n) {
      const forResult = valuateCpfSide(balFor, true, pos, state);
      cpfBets.push({
        cpfAddress: pos.cpfAddress,
        poolId: numericPoolId,
        side: "FOR",
        amount: String(balFor),
        markValue: String(forResult.open + forResult.claimable),
        resolved: isResolved,
        claimable: String(forResult.claimable),
      });
    }
    if (balAgainst > 0n) {
      const againstResult = valuateCpfSide(balAgainst, false, pos, state);
      cpfBets.push({
        cpfAddress: pos.cpfAddress,
        poolId: numericPoolId,
        side: "AGAINST",
        amount: String(balAgainst),
        markValue: String(againstResult.open + againstResult.claimable),
        resolved: isResolved,
        claimable: String(againstResult.claimable),
      });
    }
  }

  // ── TwoPools ─────────────────────────────────────────────────────────────
  let twoPoolLocked = 0n;
  let twoPoolClaimable = 0n;
  const twoPoolPos: TwoPoolPosition[] = [];

  for (const u of derived.TwoPoolUser) {
    const state = twoPoolStateMap.get(u.pool_id);
    if (!state) continue;

    const { locked, claimable } = valuateTwoPool(u, state);
    twoPoolLocked += locked;
    twoPoolClaimable += claimable;

    // Emit per-side positions for non-zero tranches
    const stableNet = toBig(u.stableNetDeposited);
    const elevatedNet = toBig(u.elevatedNetDeposited);

    if (stableNet > 0n) {
      const isResolved =
        state.state.toUpperCase() === "RESOLVED" ||
        toBig(state.sideFinalAllocationStable) > 0n;
      const tvlStable = toBig(state.sideTVLStable);
      const ytEnt = isResolved && tvlStable > 0n
        ? mulDiv(toBig(state.sideFinalAllocationStable), stableNet, tvlStable)
        : 0n;
      const ytClaim = maxBig(0n, ytEnt - toBig(u.stableClaimedYt));

      twoPoolPos.push({
        poolId: u.pool_id,
        side: "STABLE",
        netDeposited: u.stableNetDeposited,
        ytClaimable: String(ytClaim),
      });
    }

    if (elevatedNet > 0n) {
      const isResolved =
        state.state.toUpperCase() === "RESOLVED" ||
        toBig(state.sideFinalAllocationElevated) > 0n;
      const tvlElevated = toBig(state.sideTVLElevated);
      const ytEnt = isResolved && tvlElevated > 0n
        ? mulDiv(toBig(state.sideFinalAllocationElevated), elevatedNet, tvlElevated)
        : 0n;
      const ytClaim = maxBig(0n, ytEnt - toBig(u.elevatedClaimedYt));

      twoPoolPos.push({
        poolId: u.pool_id,
        side: "ELEVATED",
        netDeposited: u.elevatedNetDeposited,
        ytClaimable: String(ytClaim),
      });
    }
  }

  // ── Free YT ──────────────────────────────────────────────────────────────
  const freeYt = computeFreeYt(
    derived.UserPosition,
    derived.CPFPoolPosition,
    cpfStateMap,
    derived.RYDParticipant,
    rydStateMap,
    derived.TwoPoolUser,
    twoPoolStateMap,
  );

  // ── Total ─────────────────────────────────────────────────────────────────
  const totalValueUsdc =
    vaultPrincipal +
    vaultClaimableYield +
    freeYt +
    cpfOpen +
    cpfClaimable +
    rydLocked +
    rydClaimable +
    twoPoolLocked +
    twoPoolClaimable;

  return {
    totalValueUsdc: String(totalValueUsdc),
    breakdown: {
      vaultPrincipal: String(vaultPrincipal),
      vaultClaimableYield: String(vaultClaimableYield),
      freeYt: String(freeYt),
      cpfOpen: String(cpfOpen),
      cpfClaimable: String(cpfClaimable),
      rydLocked: String(rydLocked),
      rydClaimable: String(rydClaimable),
      twoPoolLocked: String(twoPoolLocked),
      twoPoolClaimable: String(twoPoolClaimable),
    },
    positions: {
      vaults: vaultPositions,
      ryds: rydPositions,
      cpfBets,
      twoPools: twoPoolPos,
    },
  };
}
