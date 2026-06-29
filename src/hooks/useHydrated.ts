"use client";

import { useEffect, useState } from "react";

/** True after the component has mounted — use to gate client-only UI and avoid hydration mismatches. */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}
