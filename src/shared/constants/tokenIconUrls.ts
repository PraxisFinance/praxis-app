/**
 * Balance / pool data uses this path for USDC; UI renders `UsdcTokenIcon` instead of `next/image`.
 */
export const USDC_ICON_URL = "/icons/usdc.png" as const;

export function isUsdcIconUrl(url: string | undefined): boolean {
  return url === USDC_ICON_URL;
}

/**
 * Balance / pool data uses this path for YT; UI renders `YtTokenIcon` instead of `next/image`.
 */
export const YT_ICON_URL = "/icons/yt-token.png" as const;

export function isYtIconUrl(url: string | undefined): boolean {
  return url === YT_ICON_URL;
}
