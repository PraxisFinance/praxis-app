"use client";

import { useEffect, useState } from "react";

export type PredictionCountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function getPredictionCountdownParts(endsAt: string, nowMs = Date.now()): PredictionCountdownParts {
  const endMs = new Date(endsAt).getTime();
  const totalSeconds = Math.max(0, Math.floor((endMs - nowMs) / 1000));
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

export function usePredictionCountdown(endsAt: string): PredictionCountdownParts {
  const [parts, setParts] = useState(() => getPredictionCountdownParts(endsAt));

  useEffect(() => {
    setParts(getPredictionCountdownParts(endsAt));
    const intervalId = window.setInterval(() => {
      setParts(getPredictionCountdownParts(endsAt));
    }, 1000);
    return () => window.clearInterval(intervalId);
  }, [endsAt]);

  return parts;
}
