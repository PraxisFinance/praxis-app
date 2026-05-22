import type { VaultState, UserPosition, VaultData } from "@/stores/depositsStore";
import {
  vaultStateToAvailableItem,
  userPositionToEarnPosition,
} from "@/shared/utils/earnMappers";
import type { EarnAvailableItem, EarnPosition } from "@/shared/types/earn";

const MOCK_USER_ADDRESS = "0x0000000000000000000000000000000000000001";

function usdc(amount: number): bigint {
  return BigInt(Math.round(amount * 1_000_000));
}

function nowSec(): bigint {
  return BigInt(Math.floor(Date.now() / 1000));
}

function maturityInDays(daysFromNow: number): bigint {
  return nowSec() + BigInt(daysFromNow * 86_400);
}

function depositAtDaysAgo(days: number): bigint {
  return nowSec() - BigInt(days * 86_400);
}

/** Stable vault ids for mocks and tests. */
export const MOCK_VAULT_IDS = {
  pool14d: "0x1111111111111111111111111111111111111111",
  pool30d: "0x2222222222222222222222222222222222222222",
  pool7d: "0x3333333333333333333333333333333333333333",
  poolEnded: "0x4444444444444444444444444444444444444444",
} as const;

/**
 * Примеры vault-пулов для верстки EarnPage; даты maturity относительные.
 * Включены активные пулы и один завершённый (для claim / ended position).
 */
export const MOCK_VAULT_STATES: VaultState[] = [
  {
    id: MOCK_VAULT_IDS.pool14d,
    maturity: maturityInDays(14),
    pt: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    yt: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    totalDeposited: usdc(2_450_000),
    totalWithdrawn: usdc(120_000),
    totalBalance: usdc(2_330_000),
    totalBuyInCost: usdc(48_000),
    totalYieldPaid: usdc(31_200),
    uniqueDepositors: 842,
    isPaused: false,
    owner: "0x00000000000000000000000000000000000000aa",
    lastUpdatedAt: nowSec(),
  },
  {
    id: MOCK_VAULT_IDS.pool30d,
    maturity: maturityInDays(30),
    pt: "0xcccccccccccccccccccccccccccccccccccccccc",
    yt: "0xdddddddddddddddddddddddddddddddddddddddd",
    totalDeposited: usdc(890_000),
    totalWithdrawn: usdc(45_000),
    totalBalance: usdc(845_000),
    totalBuyInCost: usdc(17_800),
    totalYieldPaid: usdc(9_400),
    uniqueDepositors: 312,
    isPaused: false,
    owner: "0x00000000000000000000000000000000000000bb",
    lastUpdatedAt: nowSec(),
  },
  {
    id: MOCK_VAULT_IDS.pool7d,
    maturity: maturityInDays(7),
    pt: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    yt: "0xffffffffffffffffffffffffffffffffffffffff",
    totalDeposited: usdc(125_500),
    totalWithdrawn: usdc(8_200),
    totalBalance: usdc(117_300),
    totalBuyInCost: usdc(2_510),
    totalYieldPaid: usdc(1_120),
    uniqueDepositors: 89,
    isPaused: false,
    owner: "0x00000000000000000000000000000000000000cc",
    lastUpdatedAt: nowSec(),
  },
  {
    id: MOCK_VAULT_IDS.poolEnded,
    maturity: maturityInDays(-2),
    pt: "0x1010101010101010101010101010101010101010",
    yt: "0x2020202020202020202020202020202020202020",
    totalDeposited: usdc(410_000),
    totalWithdrawn: usdc(398_000),
    totalBalance: usdc(12_000),
    totalBuyInCost: usdc(8_200),
    totalYieldPaid: usdc(6_750),
    uniqueDepositors: 156,
    isPaused: false,
    owner: "0x00000000000000000000000000000000000000dd",
    lastUpdatedAt: nowSec(),
  },
];

/** Позиции пользователя: активная в 14d-пуле и завершённая (claim). */
export const MOCK_USER_POSITIONS: UserPosition[] = [
  {
    id: `${MOCK_USER_ADDRESS}-${MOCK_VAULT_IDS.pool14d}`,
    vault_id: MOCK_VAULT_IDS.pool14d,
    address: MOCK_USER_ADDRESS,
    totalDeposited: usdc(15_000),
    totalWithdrawn: BigInt(0),
    currentBalance: usdc(12_500),
    totalBuyInCost: usdc(300),
    totalYieldClaimed: usdc(420),
    depositCount: 2,
    firstDepositAt: depositAtDaysAgo(21),
    lastActivityAt: depositAtDaysAgo(3),
  },
  {
    id: `${MOCK_USER_ADDRESS}-${MOCK_VAULT_IDS.poolEnded}`,
    vault_id: MOCK_VAULT_IDS.poolEnded,
    address: MOCK_USER_ADDRESS,
    totalDeposited: usdc(5_000),
    totalWithdrawn: BigInt(0),
    currentBalance: usdc(5_000),
    totalBuyInCost: usdc(100),
    totalYieldClaimed: usdc(85),
    depositCount: 1,
    firstDepositAt: depositAtDaysAgo(45),
    lastActivityAt: depositAtDaysAgo(5),
  },
];

function emptyVaultData(): VaultData {
  return {
    state: null,
    userPosition: null,
    dailySnapshots: [],
    deposits: [],
    withdrawals: [],
    redeems: [],
  };
}

/** Собирает Record для `useDepositsStore` из моков vault + positions. */
export function buildMockVaultsRecord(): Record<string, VaultData> {
  const vaults: Record<string, VaultData> = {};

  for (const state of MOCK_VAULT_STATES) {
    vaults[state.id] = { ...emptyVaultData(), state };
  }

  for (const pos of MOCK_USER_POSITIONS) {
    const vault = vaults[pos.vault_id];
    if (vault) vault.userPosition = pos;
  }

  return vaults;
}

/** UI-типы после `vaultStateToAvailableItem` (только активные пулы). */
export const EARN_AVAILABLE_ITEM_MOCKS: EarnAvailableItem[] = MOCK_VAULT_STATES.filter(
  (v) => v.maturity > nowSec(),
).map(vaultStateToAvailableItem);

/** UI-типы после `userPositionToEarnPosition`. */
export const EARN_POSITION_MOCKS: EarnPosition[] = MOCK_USER_POSITIONS.map((pos) => {
  const vault = MOCK_VAULT_STATES.find((v) => v.id === pos.vault_id) ?? null;
  return userPositionToEarnPosition(pos, vault);
});
