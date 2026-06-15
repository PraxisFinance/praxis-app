/**
 * Offchain lookups for human-readable activity feed titles.
 */

import type { PrismaClient, UserActivity } from "@prisma/client";

export type ActivityTitleContext = {
  /** Lowercase `${cpfAddress}_${poolId}` → Event.title */
  cpfEventTitleByMarketRef: Map<string, string>;
  /** Lowercase pool contract address → TwoPoolContract.name */
  twoPoolNameByAddress: Map<string, string>;
};

type ActivityRow = Pick<UserActivity, "kind" | "productAddr" | "marketRef" | "metadataJson">;

type DbForTitles = Pick<PrismaClient, "event" | "twoPoolContract">;

export function cpfMarketRefKey(cpfAddress: string, poolId: string): string {
  return `${cpfAddress}_${poolId}`.toLowerCase();
}

/** Resolve CPF contract + pool id from stored activity metadata / marketRef. */
export function extractCpfPoolRef(
  activity: ActivityRow,
): { cpfAddress: string; poolId: string } | null {
  if (!activity.kind.startsWith("CPF_")) return null;

  const meta = activity.metadataJson as Record<string, unknown>;
  const poolId = typeof meta.poolId === "string" ? meta.poolId : null;
  if (poolId) {
    const cpfAddress =
      typeof meta.cpf === "string" ? meta.cpf : activity.productAddr;
    return { cpfAddress: cpfAddress.toLowerCase(), poolId };
  }

  if (!activity.marketRef) return null;
  const sep = activity.marketRef.lastIndexOf("_");
  if (sep <= 0) return null;

  return {
    cpfAddress: activity.marketRef.slice(0, sep).toLowerCase(),
    poolId: activity.marketRef.slice(sep + 1),
  };
}

/**
 * Batch-load Event + TwoPoolContract rows needed to format activity titles.
 */
export async function fetchActivityTitleContext(
  client: DbForTitles,
  activities: ActivityRow[],
): Promise<ActivityTitleContext> {
  const cpfPairs = new Map<string, { cpfAddress: string; poolId: string }>();
  const twoPoolAddresses = new Set<string>();

  for (const activity of activities) {
    const cpfRef = extractCpfPoolRef(activity);
    if (cpfRef) {
      cpfPairs.set(cpfMarketRefKey(cpfRef.cpfAddress, cpfRef.poolId), cpfRef);
    }

    if (activity.kind === "TWOPOOL_DEPOSIT" || activity.kind === "TWOPOOL_CLAIM") {
      twoPoolAddresses.add(activity.productAddr.toLowerCase());
    }
  }

  const [events, twoPoolContracts] = await Promise.all([
    cpfPairs.size === 0
      ? Promise.resolve([])
      : client.event.findMany({
          where: {
            OR: [...cpfPairs.values()].map(({ cpfAddress, poolId }) => ({
              cpfAddress: { equals: cpfAddress, mode: "insensitive" as const },
              contractEventId: poolId,
            })),
          },
          select: {
            cpfAddress: true,
            contractEventId: true,
            title: true,
          },
        }),
    twoPoolAddresses.size === 0
      ? Promise.resolve([])
      : client.twoPoolContract.findMany({
          where: {
            address: {
              in: [...twoPoolAddresses],
              mode: "insensitive",
            },
          },
          select: { address: true, name: true },
        }),
  ]);

  const cpfEventTitleByMarketRef = new Map<string, string>();
  for (const event of events) {
    if (!event.contractEventId || !event.cpfAddress) continue;
    cpfEventTitleByMarketRef.set(
      cpfMarketRefKey(event.cpfAddress, event.contractEventId),
      event.title,
    );
  }

  const twoPoolNameByAddress = new Map<string, string>();
  for (const contract of twoPoolContracts) {
    twoPoolNameByAddress.set(contract.address.toLowerCase(), contract.name);
  }

  return { cpfEventTitleByMarketRef, twoPoolNameByAddress };
}

export function resolveCpfEventTitle(
  activity: ActivityRow,
  context: ActivityTitleContext,
): string | undefined {
  const ref = extractCpfPoolRef(activity);
  if (!ref) return undefined;
  return context.cpfEventTitleByMarketRef.get(
    cpfMarketRefKey(ref.cpfAddress, ref.poolId),
  );
}

export function resolveTwoPoolName(
  activity: ActivityRow,
  context: ActivityTitleContext,
): string | undefined {
  return context.twoPoolNameByAddress.get(activity.productAddr.toLowerCase());
}
