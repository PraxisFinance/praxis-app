import type { VaultState, UserPosition } from "@/stores/depositsStore";
import type { EarnAvailableItem, EarnPosition } from "@/shared/types/earn";
import { USDC_ICON_URL } from "@/shared/constants/tokenIconUrls";
import { formatTokenBalance } from "@/shared/utils/format";

const USDC_DECIMALS = 6;

function truncateAddress(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function formatCompactUSDC(raw: bigint): string {
  const value = Number(raw) / 10 ** USDC_DECIMALS;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toFixed(2);
}

function formatTimeLeft(maturitySec: bigint): string {
  const nowMs = Date.now();
  const maturityMs = Number(maturitySec) * 1000;
  const diff = maturityMs - nowMs;
  if (diff <= 0) return "Ended";

  const d = Math.floor(diff / (86_400_000));
  const h = Math.floor((diff % 86_400_000) / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  return `${d}d ${h}h ${m}m ${s}s`;
}

function formatStakeDate(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yy = String(date.getFullYear()).slice(-2);
  return `${dd}/${mm}/${yy}`;
}

function formatDepositTime(date: Date): string {
  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const day = date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `${time} ${day}`;
}

export function vaultStateToAvailableItem(vault: VaultState): EarnAvailableItem {
  return {
    vaultAddress: vault.id as `0x${string}`,
    queueName: `USDC Vault ${truncateAddress(vault.id)}`,
    poolLifetime: formatTimeLeft(vault.maturity),
    depositCurrency: "USDC",
    depositCurrencyIcon: "usdc",
    depositCurrencyIconUrl: USDC_ICON_URL,
    depositsAmount: formatCompactUSDC(vault.totalDeposited),
    liquidityAmount: formatCompactUSDC(vault.totalBalance),
    yieldApyPercent: "—",
    ytPayoutTime: new Date(Number(vault.maturity) * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  };
}

export function userPositionToEarnPosition(
  pos: UserPosition,
  vault: VaultState | null,
): EarnPosition {
  const nowSec = BigInt(Math.floor(Date.now() / 1000));
  const isMatured = vault ? vault.maturity <= nowSec : false;
  const depositDate = new Date(Number(pos.firstDepositAt) * 1000);

  return {
    vaultAddress: pos.vault_id as `0x${string}`,
    queueName: `USDC Vault ${truncateAddress(pos.vault_id)}`,
    poolLifetime: isMatured ? "Ended" : vault ? formatTimeLeft(vault.maturity) : "—",
    depositCurrency: "USDC",
    depositCurrencyIcon: "usdc",
    depositCurrencyIconUrl: USDC_ICON_URL,
    liquidityAmount: vault ? formatCompactUSDC(vault.totalBalance) : "—",
    depositsAmount: vault ? formatCompactUSDC(vault.totalDeposited) : "—",
    yourDeposit: formatTokenBalance(pos.currentBalance, USDC_DECIMALS),
    yieldApyPercent: "—",
    yieldGenerated: formatTokenBalance(pos.totalYieldClaimed, USDC_DECIMALS),
    stakeTime: depositDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    stakeDate: formatStakeDate(depositDate),
    depositTime: formatDepositTime(depositDate),
    status: isMatured ? "ended" : "active",
  };
}

export function earnPositionToAvailableItem(pos: EarnPosition): EarnAvailableItem {
  return {
    vaultAddress: pos.vaultAddress,
    queueName: pos.queueName,
    poolLifetime: pos.poolLifetime,
    depositCurrency: pos.depositCurrency,
    depositCurrencyIcon: pos.depositCurrencyIcon,
    depositCurrencyIconUrl: pos.depositCurrencyIconUrl,
    depositsAmount: pos.depositsAmount,
    liquidityAmount: pos.liquidityAmount,
    yieldApyPercent: pos.yieldApyPercent,
    ytPayoutTime: "—",
  };
}
