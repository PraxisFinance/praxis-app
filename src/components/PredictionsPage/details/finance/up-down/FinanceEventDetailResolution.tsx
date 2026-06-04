"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import type { FinanceHubEvent, FinanceHubEventDetail } from "@/shared/types/financeHubEvent";

interface FinanceEventDetailResolutionProps {
  event: FinanceHubEvent;
  detail: FinanceHubEventDetail;
}

export function FinanceEventDetailResolution({ event, detail }: FinanceEventDetailResolutionProps) {
  const asset =
    detail.resolutionAssetLabel ||
    (event.assetTicker.trim()
      ? `${event.assetName} (${event.assetTicker})`
      : event.assetName);

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
        {detail.resolutionSourceLabel ? (
          <p>
            The resolution source for this market is{" "}
            <span className="underline">{detail.resolutionSourceLabel}</span>.
          </p>
        ) : null}
      </div>
    </section>
  );
}
