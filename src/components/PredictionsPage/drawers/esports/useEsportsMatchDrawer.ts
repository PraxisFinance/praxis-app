"use client";

import { useCallback, useState } from "react";
import type { EsportsMatch } from "@/shared/types/esportsMatch";

export type EsportsMatchDrawerSide = "team1" | "team2";

export function useEsportsMatchDrawer() {
  const [open, setOpen] = useState(false);
  const [match, setMatch] = useState<EsportsMatch | null>(null);
  const [side, setSide] = useState<EsportsMatchDrawerSide | null>(null);

  const openDrawer = useCallback((nextMatch: EsportsMatch, nextSide: EsportsMatchDrawerSide) => {
    setMatch(nextMatch);
    setSide(nextSide);
    setOpen(true);
  }, []);

  const onOpenChange = useCallback((nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setMatch(null);
      setSide(null);
    }
  }, []);

  return {
    open,
    match,
    side,
    openDrawer,
    onOpenChange,
  };
}
