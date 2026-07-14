import { useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { useAuth } from "@/hooks/useAuth";
import { deriveClaimsFromHistory } from "@/shared/utils/userHistory/deriveClaimsFromHistory";
import type { HistoryResponse, ActivityItem, CpfPosition, RydPosition } from "@/shared/types/history";
import { useClaimsStore } from "@/stores/claimsStore";
import { useHistoryStore } from "@/stores/historyStore";
import { useStatisticsStore } from "@/stores/statisticsStore";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

async function parseApiError(res: Response): Promise<Error> {
  try {
    const body = (await res.json()) as { message?: string };
    return new Error(body.message ?? res.statusText);
  } catch {
    return new Error(res.statusText);
  }
}

// ─── Public hook ─────────────────────────────────────────────────────────────

export function useUserHistory() {
  const { address } = useAccount();
  const { getToken } = useAuth();

  const setHistory = useHistoryStore((s) => s.setHistory);
  const resetHistory = useHistoryStore((s) => s.reset);

  const setBalanceChart = useStatisticsStore((s) => s.setBalanceChart);
  const setPredictionHistory = useStatisticsStore((s) => s.setPredictionHistory);
  const setMatchStats = useStatisticsStore((s) => s.setMatchStats);
  const setCurrencyStats = useStatisticsStore((s) => s.setCurrencyStats);
  const setHistoryLoaded = useStatisticsStore((s) => s.setHistoryLoaded);
  const resetStatistics = useStatisticsStore((s) => s.reset);

  const setClaims = useClaimsStore((s) => s.setClaims);
  const resetClaims = useClaimsStore((s) => s.reset);

  const query = useQuery<HistoryResponse, Error>({
    queryKey: ["userHistory", address],
    queryFn: async () => {
      const token = await getToken();
      const res = await fetch(`${BACKEND_URL}/user-history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw await parseApiError(res);
      return res.json() as Promise<HistoryResponse>;
    },
    enabled: !!address,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });

  const populateStores = useCallback(
    (data: HistoryResponse) => {
      // Activity feed
      setHistory(
        data.activity.map((a) => ({
          id: a.id,
          time: a.time,
          text: a.title,
          amount: BigInt(a.amount),
        }))
      );

      // Balance chart (unix seconds → ms epoch)
      setBalanceChart(
        data.chart.map((p) => ({
          date: Number(p.ts) * 1000,
          balance: BigInt(p.value),
        }))
      );

      // CPF_BET and CPF_CANCEL only — CPF_CLAIM is settlement of a bet,
      // not a separate prediction event, and would double-count won bets.
      const cpfActivities = data.activity.filter(
        (a) => a.kind === "CPF_BET" || a.kind === "CPF_CANCEL"
      );
      const cpfPositions = data.portfolio.positions.cpfBets;
      const cpfHistory = cpfActivities.map((a) => ({
        id: a.id,
        date: a.time,
        label: a.title,
        status: resolveCpfStatus(a, cpfPositions),
        amount: BigInt(a.amount),
        kind: "cpf" as const,
      }));

      // RYD positions — one entry per open/closed pool the user has deposited into.
      // We match against RYD_DEPOSIT activities for the label and timestamp;
      // fall back to a generic label if no matching activity exists.
      const rydActivitiesByAddr = new Map(
        data.activity
          .filter((a) => a.kind === "RYD_DEPOSIT")
          .map((a) => [a.productAddr?.toLowerCase() ?? "", a])
      );
      const rydHistory = data.portfolio.positions.ryds.map((ryd) => {
        const activity = rydActivitiesByAddr.get(ryd.rydId.toLowerCase());
        return {
          id: `ryd-${ryd.rydId}`,
          date: activity?.time ?? Date.now(),
          label: activity?.title ?? "Random Yield Distribution",
          status: resolveRydStatus(ryd),
          amount: BigInt(ryd.deposit),
          kind: "ryd" as const,
          prize: BigInt(ryd.prize),
        };
      });

      // Prediction history (feed items)
      setPredictionHistory([...cpfHistory, ...rydHistory]);

      // Match stats from CPF positions
      const resolved = cpfPositions.filter((p) => p.resolved);
      const won = resolved.filter((p) => BigInt(p.claimable) > 0n);
      const lost = resolved.filter((p) => BigInt(p.claimable) === 0n);
      const pending = cpfPositions.filter((p) => !p.resolved);
      setMatchStats(won.length, lost.length, pending.length);

      // Currency stats
      const wonCurrency = won.reduce((acc, p) => acc + BigInt(p.claimable), 0n);
      const lostCurrency = lost.reduce((acc, p) => acc + BigInt(p.amount), 0n);
      setCurrencyStats(wonCurrency, lostCurrency);
      setHistoryLoaded(true);

      setClaims(deriveClaimsFromHistory(data));
    },
    [
      setHistory,
      setBalanceChart,
      setPredictionHistory,
      setMatchStats,
      setCurrencyStats,
      setHistoryLoaded,
      setClaims,
    ]
  );

  useEffect(() => {
    if (!query.data) return;
    populateStores(query.data);
  }, [query.data, populateStores]);

  // Clear stores when the wallet disconnects
  useEffect(() => {
    if (!address) {
      resetHistory();
      resetStatistics();
      resetClaims();
    }
  }, [address, resetHistory, resetStatistics, resetClaims]);

  return query;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function resolveCpfStatus(
  activity: ActivityItem,
  positions: CpfPosition[]
): "won" | "lost" | "pending" {
  // marketRef = "${cpfAddress}_${numericPoolId}"; cpfBets.poolId is numeric (see valuationMappers).
  const marketRef = activity.marketRef?.toLowerCase();
  const activitySide = activity.txMeta?.side;
  const pos = positions.find((p) => {
    if (`${p.cpfAddress}_${p.poolId}`.toLowerCase() !== marketRef) return false;
    if (activitySide === "FOR" || activitySide === "AGAINST") {
      return p.side === activitySide;
    }
    return true;
  });
  if (!pos?.resolved) return "pending";
  return BigInt(pos.claimable) > 0n ? "won" : "lost";
}

function resolveRydStatus(ryd: RydPosition): "won" | "lost" | "pending" {
  // Only resolve won/lost once the pool is explicitly closed. Any other state —
  // including in-between states like a pending draw request, or an unexpected/
  // future state value — must stay "pending" rather than defaulting to "lost"
  // before winners are actually decided.
  const state = ryd.state.toLowerCase();
  if (state !== "closed") return "pending";
  return ryd.isWinner && BigInt(ryd.prize) > 0n ? "won" : "lost";
}
