"use client";

import { useCallback, useState } from "react";
import type { TwoPool, TwoPoolSide } from "@/shared/types/twoPool";

export function useTwoPoolDrawer() {
  const [open, setOpen] = useState(false);
  const [pool, setPool] = useState<TwoPool | null>(null);
  const [side, setSide] = useState<TwoPoolSide | null>(null);

  const openDrawer = useCallback((nextPool: TwoPool, nextSide: TwoPoolSide) => {
    setPool(nextPool);
    setSide(nextSide);
    setOpen(true);
  }, []);

  const onOpenChange = useCallback((nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setPool(null);
      setSide(null);
    }
  }, []);

  return {
    open,
    pool,
    side,
    openDrawer,
    onOpenChange,
  };
}
