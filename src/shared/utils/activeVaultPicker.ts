import type { UserPosition, VaultState } from "@/stores/depositsStore";

export function nowSeconds(): bigint {
  return BigInt(Math.floor(Date.now() / 1000));
}

export function pickLatestVault(vaults: VaultState[]): VaultState | null {
  if (vaults.length === 0) return null;

  const now = nowSeconds();
  const nonMatured = vaults.filter((vault) => vault.maturity > now);
  const candidates = nonMatured.length > 0 ? nonMatured : vaults;

  return candidates.reduce<VaultState | null>((best, vault) => {
    if (!best) return vault;
    if (vault.maturity > best.maturity) return vault;
    if (vault.maturity === best.maturity && vault.lastUpdatedAt > best.lastUpdatedAt) {
      return vault;
    }
    return best;
  }, null);
}

export function pickVaultByRecentActivity(positions: UserPosition[]): UserPosition | null {
  const funded = positions.filter((position) => position.currentBalance > BigInt(0));
  if (funded.length === 0) return null;

  return funded.reduce<UserPosition | null>((best, position) => {
    if (!best) return position;
    if (position.lastActivityAt > best.lastActivityAt) return position;
    return best;
  }, null);
}

export function pickActiveVaultId(
  vaults: VaultState[],
  positions: UserPosition[],
  manualOverrideId: string | null
): string | null {
  if (manualOverrideId && vaults.some((vault) => vault.id === manualOverrideId)) {
    return manualOverrideId;
  }

  const byActivity = pickVaultByRecentActivity(positions);
  if (byActivity) return byActivity.vault_id;

  return pickLatestVault(vaults)?.id ?? null;
}
