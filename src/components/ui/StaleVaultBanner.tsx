"use client";

import Link from "next/link";
import { useActiveVault } from "@/stores/activeVaultStore";

export function StaleVaultBanner() {
  const { isStale } = useActiveVault();

  if (!isStale) return null;

  return (
    <div
      className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-main-darkPurple"
      role="status"
    >
      <p>
        You are using an old vault. For best UX move to the new one.{" "}
        <Link href="/earn" className="font-semibold text-main-purple underline underline-offset-2">
          Go to Earn
        </Link>
      </p>
    </div>
  );
}
