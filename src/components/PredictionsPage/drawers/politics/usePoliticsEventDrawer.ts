"use client";

import { useCallback, useState } from "react";
import type { PoliticsHubEvent } from "@/shared/types/politicsHubEvent";

export function usePoliticsEventDrawer() {
  const [open, setOpen] = useState(false);
  const [event, setEvent] = useState<PoliticsHubEvent | null>(null);
  const [selectedOutcomeId, setSelectedOutcomeId] = useState<string | null>(null);

  const openDrawer = useCallback((nextEvent: PoliticsHubEvent, outcomeId: string) => {
    setEvent(nextEvent);
    setSelectedOutcomeId(outcomeId);
    setOpen(true);
  }, []);

  const onOpenChange = useCallback((nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setEvent(null);
      setSelectedOutcomeId(null);
    }
  }, []);

  return {
    open,
    event,
    selectedOutcomeId,
    openDrawer,
    onOpenChange,
  };
}
