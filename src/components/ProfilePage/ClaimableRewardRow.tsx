"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAccount, useSwitchChain, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import { baseSepolia } from "wagmi/chains";
import { config } from "@/config/wagmi";
import { twoPoolAbi } from "@/config/contracts";
import { useCPF } from "@/hooks/useCPF";
import { useRYDClaim } from "@/hooks/useRYD";
import { useTrackAchievement } from "@/hooks/useTrackAchievement";
import type { Claim } from "@/stores/claimsStore";
import type { TwoPoolSide } from "@/shared/types/twoPool";
import { claimToRewardClaimItem } from "./claimDisplayMapper";
import { RewardClaimRow } from "./RewardClaimRow";

// ─── CPF ─────────────────────────────────────────────────────────────────────

interface CpfClaimableRowProps {
  claim: Claim;
  cpfAddress: `0x${string}`;
  poolId: bigint;
  onSuccess: (id: string) => void;
}

function CpfClaimableRow({ claim, cpfAddress, poolId, onSuccess }: CpfClaimableRowProps) {
  const { claim: execClaim, claimStatus, claimError } = useCPF(cpfAddress, poolId, "", false);
  const called = useRef(false);

  useEffect(() => {
    if (claimStatus === "success" && !called.current) {
      called.current = true;
      onSuccess(claim.id);
    }
  }, [claimStatus, claim.id, onSuccess]);

  return (
    <RewardClaimRow
      item={claimToRewardClaimItem(claim)}
      onClaim={() => void execClaim()}
      isPending={claimStatus === "claiming"}
      errorMessage={claimStatus === "error" ? claimError : null}
    />
  );
}

// ─── RYD ─────────────────────────────────────────────────────────────────────

interface RydClaimableRowProps {
  claim: Claim;
  rydAddress: `0x${string}`;
  onSuccess: (id: string) => void;
}

function RydClaimableRow({ claim, rydAddress, onSuccess }: RydClaimableRowProps) {
  const { claim: execClaim, status, errorMessage, isPending } = useRYDClaim(rydAddress);
  const called = useRef(false);

  useEffect(() => {
    if (status === "success" && !called.current) {
      called.current = true;
      onSuccess(claim.id);
    }
  }, [status, claim.id, onSuccess]);

  return (
    <RewardClaimRow
      item={claimToRewardClaimItem(claim)}
      onClaim={() => void execClaim()}
      isPending={isPending}
      errorMessage={status === "error" ? errorMessage : null}
    />
  );
}

// ─── TwoPool ─────────────────────────────────────────────────────────────────

type TwoPoolClaimStatus = "idle" | "claiming" | "success" | "error";

interface TwoPoolClaimableRowProps {
  claim: Claim;
  poolAddress: `0x${string}`;
  side: TwoPoolSide;
  onSuccess: (id: string) => void;
}

function TwoPoolClaimableRow({ claim, poolAddress, side, onSuccess }: TwoPoolClaimableRowProps) {
  const { address } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const { trackAchievement } = useTrackAchievement();
  const [status, setStatus] = useState<TwoPoolClaimStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const called = useRef(false);

  const sideUint8: 0 | 1 = side === "stable" ? 0 : 1;

  const execClaim = useCallback(async () => {
    if (!address) return;
    try {
      setErrorMessage(null);
      setStatus("claiming");
      await switchChainAsync({ chainId: baseSepolia.id });
      const tx = await writeContractAsync({
        address: poolAddress,
        abi: twoPoolAbi,
        functionName: "claimTrader",
        args: [sideUint8],
        chainId: baseSepolia.id,
      });
      await waitForTransactionReceipt(config, { hash: tx });
      trackAchievement("twopool.claim", tx);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Transaction failed");
    }
  }, [address, poolAddress, sideUint8, switchChainAsync, writeContractAsync, trackAchievement]);

  useEffect(() => {
    if (status === "success" && !called.current) {
      called.current = true;
      onSuccess(claim.id);
    }
  }, [status, claim.id, onSuccess]);

  return (
    <RewardClaimRow
      item={claimToRewardClaimItem(claim)}
      onClaim={() => void execClaim()}
      isPending={status === "claiming"}
      errorMessage={status === "error" ? errorMessage : null}
    />
  );
}

// ─── Dispatcher ──────────────────────────────────────────────────────────────

interface ClaimableRewardRowProps {
  claim: Claim;
  onSuccess: (id: string) => void;
}

export function ClaimableRewardRow({ claim, onSuccess }: ClaimableRewardRowProps) {
  const [type, ...parts] = claim.eventId.split(":");

  if (type === "cpf") {
    const cpfAddress = parts[0] as `0x${string}`;
    const poolId = BigInt(parts[1] ?? "0");
    return (
      <CpfClaimableRow
        claim={claim}
        cpfAddress={cpfAddress}
        poolId={poolId}
        onSuccess={onSuccess}
      />
    );
  }

  if (type === "ryd") {
    const rydAddress = parts[0] as `0x${string}`;
    return <RydClaimableRow claim={claim} rydAddress={rydAddress} onSuccess={onSuccess} />;
  }

  if (type === "twopool") {
    const poolAddress = parts[0] as `0x${string}`;
    // History stores side as "STABLE"/"ELEVATED"; TwoPoolSide is lowercase
    const side = (parts[1]?.toLowerCase() ?? "stable") as TwoPoolSide;
    return (
      <TwoPoolClaimableRow
        claim={claim}
        poolAddress={poolAddress}
        side={side}
        onSuccess={onSuccess}
      />
    );
  }

  // Unknown type — display-only fallback
  return <RewardClaimRow item={claimToRewardClaimItem(claim)} onClaim={() => undefined} />;
}
