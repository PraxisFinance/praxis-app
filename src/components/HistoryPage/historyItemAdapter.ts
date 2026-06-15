import type { BalanceCurrencyKey } from "@/shared/types/balances";
import type { HistoryEvent, HistoryEventType } from "@/shared/types/history";
import type { HistoryItem } from "@/stores/historyStore";

const USDC_DECIMALS = 6;

export type HistoryDisplayEvent = HistoryEvent & { label: string };

function inferEventType(text: string): HistoryEventType {
  const lower = text.toLowerCase();
  if (lower.includes("deposit")) return "DEPOSIT";
  if (lower.includes("withdraw")) return "WITHDRAW";
  if (lower.includes("claim")) return "PREDICTION_WINNING_CLAIM";
  if (lower.includes("earn") || lower.includes("yield")) return "EARN";
  if (lower.includes("bet") || lower.includes("prediction")) return "PREDICTION";
  return "PREDICTION";
}

function inferAmountCurrency(text: string, type: HistoryEventType): BalanceCurrencyKey {
  const lower = text.toLowerCase();
  if (lower.includes("yt") || type === "EARN") return "ytToken";
  if (lower.includes("vault") || lower.includes("deposit")) return "deposit";
  return "wallet";
}

function bigintToDisplayAmount(amount: bigint, decimals = USDC_DECIMALS): number {
  const sign = amount >= 0n ? 1 : -1;
  const abs = amount >= 0n ? amount : -amount;
  const divisor = 10 ** decimals;
  return sign * (Number(abs) / divisor);
}

export function historyItemToDisplayEvent(item: HistoryItem): HistoryDisplayEvent {
  const type = inferEventType(item.text);
  return {
    id: item.id,
    timestamp: item.time,
    type,
    amount: bigintToDisplayAmount(item.amount),
    amountCurrency: inferAmountCurrency(item.text, type),
    label: item.text,
  };
}
