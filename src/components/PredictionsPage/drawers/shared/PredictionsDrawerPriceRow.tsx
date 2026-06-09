"use client";

interface PredictionsDrawerPriceRowProps {
  priceLabel: string;
}

export function PredictionsDrawerPriceRow({ priceLabel }: PredictionsDrawerPriceRowProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-main-darkPurple/55 text-sm">Price</span>
      <span className="text-main-darkPurple text-sm font-medium tabular-nums">{priceLabel}</span>
    </div>
  );
}
