"use client";

import { HubBinaryMarketDrawerHeading } from "../../shared/HubBinaryMarketDrawerHeading";

interface TechEventDrawerHeadingProps {
  thumbnailUrl: string;
}

export function TechEventDrawerHeading({ thumbnailUrl }: TechEventDrawerHeadingProps) {
  return <HubBinaryMarketDrawerHeading imageUrl={thumbnailUrl} />;
}
