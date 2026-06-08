"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import type {
  CryptoPrediction,
  CryptoPredictionHubMarketDetail,
} from "@/shared/types/cryptoPrediction";

interface CryptoPredictionHubDetailResolutionProps {
  prediction: CryptoPrediction;
  detail: CryptoPredictionHubMarketDetail;
}

export function CryptoPredictionHubDetailResolution({
  prediction,
  detail,
}: CryptoPredictionHubDetailResolutionProps) {
  const asset = detail.resolutionAssetLabel;

  return (
    <section className="flex flex-col gap-3">
      <SectionHeader className="text-main-darkPurple text-xl">Resolution</SectionHeader>
      <div className="text-main-darkPurple space-y-3 text-sm leading-relaxed">
        {prediction.predictionType === "up_down" ? (
          <>
            <p>
              This market will resolve to &ldquo;Up&rdquo; if the Close price for{" "}
              <span className="underline">{asset}</span> on {detail.resolutionCloseDateLabel} is
              strictly higher than the Close price of the previous trading day. Otherwise, it will
              resolve to &ldquo;Down&rdquo;.
            </p>
            <p>
              The Close price for <span className="underline">{asset}</span> captured on{" "}
              {detail.resolutionReferenceDateLabel} was {detail.resolutionReferencePriceLabel}.
            </p>
          </>
        ) : null}

        {prediction.predictionType === "above_below" ? (
          <>
            <p>
              Each strike resolves to &ldquo;Yes&rdquo; if the Close price for{" "}
              <span className="underline">{asset}</span> on {detail.resolutionCloseDateLabel} is at
              or above the listed level. Otherwise, it resolves to &ldquo;No&rdquo;.
            </p>
            <p>
              The Close price for <span className="underline">{asset}</span> captured on{" "}
              {detail.resolutionReferenceDateLabel} was {detail.resolutionReferencePriceLabel}.
            </p>
          </>
        ) : null}

        {prediction.predictionType === "price_range" ? (
          <>
            <p>
              This market will resolve to &ldquo;Inside range&rdquo; if the Close price for{" "}
              <span className="underline">{asset}</span> on {detail.resolutionCloseDateLabel} is
              between {prediction.lowerBoundLabel} and {prediction.upperBoundLabel} (inclusive).
              Otherwise, it will resolve to &ldquo;Outside range&rdquo;.
            </p>
            <p>
              The Close price for <span className="underline">{asset}</span> captured on{" "}
              {detail.resolutionReferenceDateLabel} was {detail.resolutionReferencePriceLabel}.
            </p>
          </>
        ) : null}

        {prediction.predictionType === "hit" ? (
          <>
            <p>
              This market will resolve to &ldquo;Hit&rdquo; if the price of{" "}
              <span className="underline">{asset}</span> reaches or exceeds{" "}
              {prediction.targetPriceLabel} at any point before {detail.resolutionCloseDateLabel}.
              Otherwise, it will resolve to &ldquo;Miss&rdquo;.
            </p>
            <p>
              The reference price for <span className="underline">{asset}</span> captured on{" "}
              {detail.resolutionReferenceDateLabel} was {detail.resolutionReferencePriceLabel}.
            </p>
          </>
        ) : null}

        {prediction.description ? (
          <p className="text-main-darkPurple/70 text-xs">{prediction.description}</p>
        ) : null}
      </div>
    </section>
  );
}
