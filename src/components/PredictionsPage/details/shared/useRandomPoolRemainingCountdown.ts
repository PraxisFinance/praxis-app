"use client";

import { useEffect, useState } from "react";
import type { RandomPoolRemainingTime } from "@/shared/types/randomPool";
import { decrementRandomPoolRemainingTime } from "@/shared/utils/randomPoolFormat";

export function useRandomPoolRemainingCountdown(
  initial: RandomPoolRemainingTime,
): RandomPoolRemainingTime {
  const [remaining, setRemaining] = useState(initial);

  useEffect(() => {
    setRemaining(initial);
  }, [initial]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setRemaining((prev) => decrementRandomPoolRemainingTime(prev));
    }, 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  return remaining;
}
