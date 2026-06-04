"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import type {
  CryptoPredictionUpDown,
  CryptoPredictionUpDownDetail,
} from "@/shared/types/cryptoPrediction";

interface CryptoPredictionUpDownResolutionProps {
  prediction: CryptoPredictionUpDown;
  detail: CryptoPredictionUpDownDetail;
}

export function CryptoPredictionUpDownResolution({
  prediction,
  detail,
}: CryptoPredictionUpDownResolutionProps) {
  const asset = detail.resolutionAssetLabel;

  return (
    <section className="flex flex-col gap-3">
      <SectionHeader className="text-main-darkPurple text-xl">Resolution</SectionHeader>
      <div className="text-main-darkPurple space-y-3 text-sm leading-relaxed">
        <p>
          This market will resolve to &ldquo;Up&rdquo; if the Close price for{" "}
          <span className="underline">{asset}</span> on {detail.resolutionCloseDateLabel} is strictly
          higher than the Close price of the previous trading day. Otherwise, it will resolve to
          &ldquo;Down&rdquo;.
        </p>
        <p>
          The Close price for <span className="underline">{asset}</span> captured on{" "}
          {detail.resolutionReferenceDateLabel} was {detail.resolutionReferencePriceLabel}.
        </p>
        {prediction.description ? (
          <p className="text-main-darkPurple/70 text-xs">{prediction.description}</p>
        ) : null}
      </div>
    </section>
  );
}
