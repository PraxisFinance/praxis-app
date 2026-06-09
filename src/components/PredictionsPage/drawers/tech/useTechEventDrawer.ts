"use client";

import { useCallback, useState } from "react";
import type { TechHubEvent } from "@/shared/types/techHubEvent";

export function useTechEventDrawer() {
  const [open, setOpen] = useState(false);
  const [event, setEvent] = useState<TechHubEvent | null>(null);
  const [selectedOutcomeId, setSelectedOutcomeId] = useState<string | null>(null);

  const openDrawer = useCallback((nextEvent: TechHubEvent, outcomeId: string) => {
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
