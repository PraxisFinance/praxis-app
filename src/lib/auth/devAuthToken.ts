/** Default dev JWT — used when `NODE_ENV === "development"` unless overridden by env. */
const DEFAULT_DEV_AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIweDI5ZWFkMzY0YjQ1ZjA4ODVjNmJhOTE3NDUwMWQ5YWFiNTc2MzYwNDQiLCJpYXQiOjE3ODIzMjIwNzMsImV4cCI6MTgxMzg1ODA3M30.Ggo4lH50aKBF4ZrLfCWYiizX8r98IaxFEfWsFNpXcdk";

export function isDevAuthEnabled(): boolean {
  return process.env.NODE_ENV === "development";
}

export function getDevAuthToken(): string | null {
  if (!isDevAuthEnabled()) return null;

  const fromEnv = process.env.NEXT_PUBLIC_DEV_AUTH_TOKEN?.trim();
  return fromEnv ?? null;
}

/** Wallet address encoded in the default dev JWT (`sub` claim). */
export function getDevAuthAddress(): `0x${string}` | null {
  if (!getDevAuthToken()) return null;
  return "0x29ead364b45f0885c6ba9174501d9aab57636044";
}

export function canUseAuthenticatedApi(address: string | undefined): boolean {
  return !!address || !!getDevAuthToken();
}

export function resolveAuthAddress(address: string | undefined): string | undefined {
  return address ?? getDevAuthAddress() ?? undefined;
}
