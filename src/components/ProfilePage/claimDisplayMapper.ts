import { YT_ICON_URL } from "@/shared/constants/tokenIconUrls";
import type { RewardClaimItem } from "@/shared/types/profile";
import type { Claim } from "@/stores/claimsStore";

const USDC_DECIMALS = 6;

function bigintToDisplayAmount(amount: bigint): number {
  return Number(amount) / 10 ** USDC_DECIMALS;
}

function formatPoolIdLabel(id: string): string {
  if (id.length <= 10) return id;
  return `${id.slice(0, 6)}…${id.slice(-4)}`;
}

export function claimToRewardClaimItem(claim: Claim): RewardClaimItem {
  const [type, ...parts] = claim.eventId.split(":");

  if (type === "cpf") {
    const poolId = parts[1] ?? "";
    return {
      id: claim.id,
      name: `Prediction winnings #${poolId}`,
      iconUrl: YT_ICON_URL,
      income: bigintToDisplayAmount(claim.income),
      incomeCurrency: "ytPraxis",
    };
  }

  if (type === "ryd") {
    const rydId = parts[0] ?? "";
    return {
      id: claim.id,
      name: `Random pool #${formatPoolIdLabel(rydId)} prize`,
      iconUrl: YT_ICON_URL,
      income: bigintToDisplayAmount(claim.income),
      incomeCurrency: "ytPraxis",
    };
  }

  if (type === "twopool") {
    const poolId = parts[0] ?? "";
    const side = parts[1] ?? "";
    return {
      id: claim.id,
      name: `TwoPool #${poolId} ${side} rewards`,
      iconUrl: YT_ICON_URL,
      income: bigintToDisplayAmount(claim.income),
      incomeCurrency: "ytPraxis",
    };
  }

  return {
    id: claim.id,
    name: claim.eventId,
    iconUrl: YT_ICON_URL,
    income: bigintToDisplayAmount(claim.income),
    incomeCurrency: "ytPraxis",
  };
}
