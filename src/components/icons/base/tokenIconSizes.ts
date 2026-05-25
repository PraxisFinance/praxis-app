export const TOKEN_ICON_SIZES = [12, 14, 16, 18, 24, 32] as const;

export type TokenIconSize = (typeof TOKEN_ICON_SIZES)[number];

export const DEFAULT_TOKEN_ICON_SIZE: TokenIconSize = 24;
