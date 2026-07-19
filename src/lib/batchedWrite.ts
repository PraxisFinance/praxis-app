import { encodeFunctionData, type Abi } from "viem";
import {
  getCapabilities,
  sendCalls,
  sendTransaction,
  waitForCallsStatus,
  waitForTransactionReceipt,
} from "wagmi/actions";
import { config } from "@/config/wagmi";
import { APP_CHAIN_ID } from "@/lib/ensureAppChain";

/**
 * A single contract write, expressed independently of the transport so the same
 * description can be submitted either as an EIP-5792 atomic batch or as a plain
 * `eth_sendTransaction` in the sequential fallback.
 */
export interface ContractCall {
  address: `0x${string}`;
  abi: Abi;
  functionName: string;
  args?: readonly unknown[];
}

export interface BatchedWriteResult {
  /**
   * A representative transaction hash for the run (the last call). Undefined
   * only when an atomic batch resolves without exposing receipts.
   */
  hash?: `0x${string}`;
  /** True when the calls were submitted as a single atomic EIP-5792 batch. */
  batched: boolean;
}

export interface BatchedWriteOptions {
  /**
   * Invoked before each transaction is submitted. In atomic mode it fires once
   * with `(0, 1)`; in sequential mode it fires before every call. Lets callers
   * drive their own multi-step status UI (e.g. "approving" → "depositing").
   */
  onStep?: (index: number, total: number) => void;
}

/**
 * Delay inserted between sequential transactions in the fallback path.
 *
 * Some mini-app / injected wallets tear down and re-create their confirmation
 * surface between rapid back-to-back requests, which makes the second popup
 * close before the user can sign it (they then have to retry). A short settle
 * window — plus letting the previous receipt fully propagate — avoids that race
 * and stale allowance reads. Only relevant when the wallet cannot batch.
 */
const SEQUENTIAL_TX_DELAY_MS = 1500;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Detects whether the connected wallet can execute an atomic batch on the app
 * chain (EIP-5792 `wallet_sendCalls`). Base Account supports this; plain EOA
 * wallets that don't implement `wallet_getCapabilities` fall back to sequential.
 */
async function supportsAtomicBatch(): Promise<boolean> {
  try {
    const capabilities = await getCapabilities(config);
    const chainCaps = capabilities?.[APP_CHAIN_ID] as
      | { atomicBatch?: { supported?: boolean }; atomic?: { status?: string } }
      | undefined;

    if (chainCaps?.atomicBatch?.supported) return true;

    // Newer EIP-5792 wallets report `atomic.status` instead of `atomicBatch`.
    const atomicStatus = chainCaps?.atomic?.status;
    return atomicStatus === "supported" || atomicStatus === "ready";
  } catch {
    // Wallet doesn't implement wallet_getCapabilities → assume no batching.
    return false;
  }
}

/**
 * Executes one or more contract writes, preferring a single atomic batch when
 * the wallet supports EIP-5792 and otherwise running them sequentially with a
 * short delay between transactions.
 *
 * Falsy entries are skipped so callers can conditionally include steps such as
 * a token approval:
 *
 * ```ts
 * await runBatchedWrite([
 *   needsApproval && { address: token, abi: erc20Abi, functionName: "approve", args: [spender, amount] },
 *   { address: pool, abi: poolAbi, functionName: "deposit", args: [amount] },
 * ]);
 * ```
 *
 * The caller is responsible for switching to the app chain beforehand.
 */
export async function runBatchedWrite(
  calls: (ContractCall | false | null | undefined)[],
  options?: BatchedWriteOptions,
): Promise<BatchedWriteResult> {
  const filtered = calls.filter((call): call is ContractCall => Boolean(call));
  if (filtered.length === 0) {
    throw new Error("runBatchedWrite: no calls to execute");
  }

  const encoded = filtered.map((call) => ({
    to: call.address,
    data: encodeFunctionData({
      abi: call.abi,
      functionName: call.functionName,
      args: call.args,
    }),
  }));

  if (encoded.length > 1 && (await supportsAtomicBatch())) {
    options?.onStep?.(0, 1);
    const { id } = await sendCalls(config, { chainId: APP_CHAIN_ID, calls: encoded });
    const result = await waitForCallsStatus(config, { id });
    const receipts = result.receipts;
    const hash = receipts && receipts.length > 0 ? receipts[receipts.length - 1].transactionHash : undefined;
    return { hash, batched: true };
  }

  let lastHash: `0x${string}` | undefined;
  for (let index = 0; index < encoded.length; index++) {
    if (index > 0) await sleep(SEQUENTIAL_TX_DELAY_MS);
    options?.onStep?.(index, encoded.length);

    lastHash = await sendTransaction(config, {
      chainId: APP_CHAIN_ID,
      to: encoded[index].to,
      data: encoded[index].data,
    });
    await waitForTransactionReceipt(config, { hash: lastHash });
  }

  return { hash: lastHash, batched: false };
}
