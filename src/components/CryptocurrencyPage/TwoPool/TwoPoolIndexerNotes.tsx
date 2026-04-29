import type { TwoPool } from "@/shared/types/twoPool";

export function TwoPoolIndexerNotes({ pool }: { pool: TwoPool }) {
  if (pool.indexerGaps.length === 0) return null;
  return (
    <div className="rounded-sm border border-amber-500/35 bg-amber-500/10 px-2.5 py-2">
      <p className="text-main-darkPurple text-2xs font-semibold">What Envio does not expose on TwoPoolState</p>
      <ul className="text-main-darkPurple/90 mt-1.5 list-inside list-disc space-y-1 text-2xs leading-snug">
        {pool.indexerGaps.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  );
}
