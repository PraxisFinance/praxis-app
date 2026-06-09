"use client";

import { useEffect, useState } from "react";

export type PredictionCountdownParts = {
  minutes: number;
  seconds: number;
};

export function getPredictionCountdownParts(endsAt: string, nowMs = Date.now()): PredictionCountdownParts {
  const endMs = new Date(endsAt).getTime();
  const totalSeconds = Math.max(0, Math.floor((endMs - nowMs) / 1000));
  return {
    minutes: Math.floor(totalSeconds / 60),
    seconds: totalSeconds % 60,
  };
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
