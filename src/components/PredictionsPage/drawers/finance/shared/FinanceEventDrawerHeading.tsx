"use client";

import { HubBinaryMarketDrawerHeading } from "../../shared/HubBinaryMarketDrawerHeading";

interface FinanceEventDrawerHeadingProps {
  logoUrl: string;
}

export function FinanceEventDrawerHeading({ logoUrl }: FinanceEventDrawerHeadingProps) {
  return <HubBinaryMarketDrawerHeading imageUrl={logoUrl} imageFit="contain" />;
}
