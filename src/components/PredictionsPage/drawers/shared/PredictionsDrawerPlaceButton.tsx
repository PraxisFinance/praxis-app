"use client";

import { Button } from "@/components/ui/button";

interface PredictionsDrawerPlaceButtonProps {
  disabled?: boolean;
  onClick: () => void;
  label?: string;
}

export function PredictionsDrawerPlaceButton({
  disabled = false,
  onClick,
  label = "Place prediction",
}: PredictionsDrawerPlaceButtonProps) {
  return (
    <Button variant="primary" size="action" disabled={disabled} onClick={onClick}>
      {label}
    </Button>
  );
}
