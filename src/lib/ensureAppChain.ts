import { baseSepolia } from "wagmi/chains";

export const APP_CHAIN = baseSepolia;
export const APP_CHAIN_ID = baseSepolia.id;

type SwitchFn = (args: { chainId: typeof APP_CHAIN_ID }) => Promise<unknown>;

/**
 * Switches the connected wallet to the app chain (Base Sepolia) when needed.
 * Matches the single-chain wagmi config in `@/config/wagmi`.
 */
export async function ensureAppChain(
  currentChainId: number | undefined,
  switchChainAsync: SwitchFn | undefined
): Promise<void> {
  if (currentChainId === APP_CHAIN_ID) return;
  if (!switchChainAsync) {
    throw new Error("This wallet does not support switching to Base Sepolia");
  }
  await switchChainAsync({ chainId: APP_CHAIN_ID });
}
