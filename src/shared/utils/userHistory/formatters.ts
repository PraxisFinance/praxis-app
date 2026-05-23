/**
 * Human-readable title strings for the activity feed.
 * Pure function — no I/O.
 */

import type { ActivityKind } from "@/shared/types/history";

export type ActivityTitleLabels = {
  /** Event.title for the CPF pool (from Prisma Event). */
  cpfEventTitle?: string;
  /** TwoPoolContract.name for the pool contract address. */
  twoPoolName?: string;
};

function cpfSideLabel(meta: Record<string, unknown>): string | null {
  if (meta.side === "FOR") return "For";
  if (meta.side === "AGAINST") return "Against";
  return null;
}

function twoPoolSideLabel(meta: Record<string, unknown>): "Stable" | "Elevated" {
  return meta.side === "ELEVATED" ? "Elevated" : "Stable";
}

function formatCpfBetTitle(
  eventTitle: string | undefined,
  meta: Record<string, unknown>,
): string {
  const side = cpfSideLabel(meta);
  if (eventTitle && side) return `${eventTitle} - ${side}`;
  if (eventTitle) return eventTitle;
  if (side) return side;
  return "Placed bet";
}

/**
 * Build a display title for an activity feed row.
 */
export function formatActivityTitle(
  kind: ActivityKind,
  meta: Record<string, unknown>,
  labels: ActivityTitleLabels = {},
): string {
  const { cpfEventTitle, twoPoolName } = labels;

  switch (kind) {
    case "VAULT_DEPOSIT":
      return "Deposited to Yield Vault";

    case "VAULT_WITHDRAW":
      return "Withdrew from Vault";

    case "VAULT_REDEEM_YIELD":
      return "Claimed yield";

    case "RYD_DEPOSIT":
    case "RYD_WITHDRAW":
    case "RYD_CLAIM":
      return "Random Yield Distribution";

    case "CPF_BET":
      return formatCpfBetTitle(cpfEventTitle, meta);

    case "CPF_CANCEL":
      return cpfEventTitle ? `Cancelled bet — ${cpfEventTitle}` : "Cancelled bet";

    case "CPF_CLAIM":
      return cpfEventTitle ? `Claimed winnings — ${cpfEventTitle}` : "Claimed winnings";

    case "CPF_WITHDRAW":
      return "Withdrew from prediction";

    case "TWOPOOL_DEPOSIT":
    case "TWOPOOL_CLAIM": {
      const side = twoPoolSideLabel(meta);
      const name = twoPoolName ?? "Two Pool";
      return `${name} - ${side}`;
    }

    default:
      return "Activity";
  }
}
