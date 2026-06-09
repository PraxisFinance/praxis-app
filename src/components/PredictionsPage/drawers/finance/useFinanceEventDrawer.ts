"use client";

import { useCallback, useState } from "react";
import type { FinanceHubEvent } from "@/shared/types/financeHubEvent";

export function useFinanceEventDrawer() {
  const [open, setOpen] = useState(false);
  const [event, setEvent] = useState<FinanceHubEvent | null>(null);
  const [selectedOutcomeId, setSelectedOutcomeId] = useState<string | null>(null);

  const openDrawer = useCallback((nextEvent: FinanceHubEvent, outcomeId: string) => {
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
