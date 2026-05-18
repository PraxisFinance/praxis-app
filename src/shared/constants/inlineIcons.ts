/**
 * When `iconUrl` / `avatarUrl` equals this value, UI renders `HintIcon`
 * instead of `next/image` (not a public asset path).
 */
export const INLINE_HINT_ICON_URL = "__praxis/icons/hint__" as const;

export function isInlineHintIconUrl(url: string | undefined): boolean {
  return url === INLINE_HINT_ICON_URL;
}
