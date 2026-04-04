import type { RYDData, RYDParticipant, RYDWinner } from "@/stores/rydStore";
import { formatRYDAmount, shortenAddress } from "@/stores/rydStore";
import type {
  RandomPool,
  RandomPoolRemainingTime,
  RandomPoolUserInPool,
} from "@/shared/types/randomPool";

const YT_DECIMALS = 6;
const ASSUMED_POOL_DURATION_SEC = 7 * 86_400;

function calcRemainingTime(endTimeSec: bigint): RandomPoolRemainingTime & { totalSeconds: number } {
  const nowSec = Math.floor(Date.now() / 1000);
  const remaining = Math.max(0, Number(endTimeSec) - nowSec);
  return {
    days: Math.floor(remaining / 86_400),
    hours: Math.floor((remaining % 86_400) / 3_600),
    minutes: Math.floor((remaining % 3_600) / 60),
    seconds: remaining % 60,
    totalSeconds: remaining,
  };
}

export function rydDataToRandomPool(data: RYDData): RandomPool | null {
  const { state, config, userParticipation } = data;
  if (!state) return null;

  const isLive = state.state === "Open" || state.state === "DrawRequested";
  const tvl = formatRYDAmount(state.totalDeposits, YT_DECIMALS);
  const totalPrize = state.prizePerWinner * BigInt(state.numWinners);

  if (isLive) {
    const rt = calcRemainingTime(state.endTime);
    const progressPercent =
      rt.totalSeconds <= 0
        ? 100
        : Math.min(
            100,
            Math.max(0, Math.round((1 - rt.totalSeconds / ASSUMED_POOL_DURATION_SEC) * 100)),
          );

    return {
      id: config.key,
      title: config.label,
      iconUrl: "/icons/yt-token.png",
      status: "live",
      tvl,
      expectedYield: formatRYDAmount(totalPrize, YT_DECIMALS),
      usersIn: state.participantCount,
      progressPercent,
      remainingTime: {
        days: rt.days,
        hours: rt.hours,
        minutes: rt.minutes,
        seconds: rt.seconds,
      },
    };
  }

  return {
    id: config.key,
    title: config.label,
    iconUrl: "/icons/yt-token.png",
    status: "ended",
    tvl,
    earnings: formatRYDAmount(totalPrize, YT_DECIMALS),
    usersWon: state.numWinners,
    usersInPool: state.participantCount,
    progressPercent: 100,
    userWon: userParticipation?.isWinner ?? false,
  };
}

export function rydParticipantToPoolUser(p: RYDParticipant): RandomPoolUserInPool {
  return {
    username: shortenAddress(p.address),
    amount: formatRYDAmount(p.depositAmount, YT_DECIMALS),
    currencyIconUrl: "/icons/yt-token.png",
  };
}

export function rydWinnerToPoolUser(w: RYDWinner): RandomPoolUserInPool {
  return {
    username: shortenAddress(w.address),
    amount: formatRYDAmount(w.prizeAmount, YT_DECIMALS),
    currencyIconUrl: "/icons/yt-token.png",
  };
}

export function filterRydPools(
  pools: RandomPool[],
  filter: string,
): RandomPool[] {
  switch (filter) {
    case "live":
      return pools.filter((p) => p.status === "live");
    case "ended":
      return pools.filter((p) => p.status === "ended");
    case "1h":
    case "12h":
    case "1d":
    case "1w": {
      const maxSec = { "1h": 3_600, "12h": 43_200, "1d": 86_400, "1w": 604_800 }[filter];
      return pools.filter(
        (p) =>
          p.status === "live" &&
          p.remainingTime.days * 86_400 +
            p.remainingTime.hours * 3_600 +
            p.remainingTime.minutes * 60 +
            p.remainingTime.seconds <=
            maxSec,
      );
    }
    default:
      return pools;
  }
}
