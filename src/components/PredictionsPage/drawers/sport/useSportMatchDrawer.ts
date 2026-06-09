"use client";

import { useCallback, useState } from "react";
import type { SportHubMatch } from "@/shared/types/sportHubMatch";

export type SportMatchDrawerSide = "team1" | "team2";

export function useSportMatchDrawer() {
  const [open, setOpen] = useState(false);
  const [match, setMatch] = useState<SportHubMatch | null>(null);
  const [side, setSide] = useState<SportMatchDrawerSide | null>(null);

  const openDrawer = useCallback((nextMatch: SportHubMatch, nextSide: SportMatchDrawerSide) => {
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
