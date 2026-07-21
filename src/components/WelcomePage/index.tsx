"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertCircle, Check } from "lucide-react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useReferral } from "@/hooks/useReferral";
import { MAIN_ROUTE } from "@/lib/routes";

export function WelcomePage() {
  const router = useRouter();
  const { address } = useAccount();
  const { bindCode, resetBind, bindStatus, bindError } = useReferral();

  const [referralLink, setReferralLink] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const isBindPending =
    bindStatus === "fetching-params" || bindStatus === "signing" || bindStatus === "binding";
  const isBindSuccess = bindStatus === "success";
  const displayError = localError ?? bindError;

  async function handleBind() {
    const code = referralLink.trim().split("/").pop() ?? "";
    if (!code) return;
    if (!address) {
      setLocalError("Connect your wallet to apply a referral code.");
      return;
    }
    setLocalError(null);
    await bindCode(code);
  }

  function handleReferralChange(value: string) {
    setReferralLink(value);
    setLocalError(null);
    if (bindStatus === "error") resetBind();
  }

  function handleGetStarted() {
    router.push(MAIN_ROUTE);
  }

  return (
    <div className="mx-auto flex h-dvh max-h-dvh w-full max-w-md flex-col overflow-hidden bg-white px-5 pt-10 pb-4">
      <h1 className="text-main-darkPurple text-center text-header-1 shrink-0">
        Welcome to Praxis: A new approach to prediction markets
      </h1>

      <div className="w-full">
        <Image
          src="/welcome.png"
          alt="Praxis handheld console"
          width={385}
          height={492}
          priority
          sizes="100vw"
          className="h-auto w-full"
          style={{ width: "100%", height: "auto" }}
        />
      </div>

      <div className="flex shrink-0 flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-row items-stretch gap-2">
            <Input
              value={referralLink}
              onChange={(event) => handleReferralChange(event.target.value)}
              onKeyDown={(e) => e.key === "Enter" && void handleBind()}
              placeholder="Enter referral link"
              disabled={isBindSuccess || isBindPending}
              className="bg-main-lightGray text-main-darkPurple placeholder:text-main-darkPurple/45 min-h-12 min-w-0 flex-1 rounded-lg border-0 px-3 py-2 text-sm leading-normal shadow-none outline-none focus-visible:ring-0 sm:px-4 sm:text-base"
            />
            <button
              type="button"
              className="bg-main-purple text-white flex size-12 shrink-0 items-center justify-center rounded-lg disabled:opacity-50"
              aria-label="Apply referral code"
              onClick={() => void handleBind()}
              disabled={!referralLink.trim() || isBindSuccess || isBindPending}
            >
              <Check className="size-5 shrink-0" />
            </button>
          </div>

          {displayError && (
            <p className="text-red-500 flex flex-row items-start gap-1.5 text-2xs leading-snug sm:text-xs">
              <AlertCircle className="mt-0.5 size-3 shrink-0" />
              <span>{displayError}</span>
            </p>
          )}
          {isBindPending && (
            <p className="text-main-darkPurple/70 flex flex-row items-start gap-1.5 text-2xs leading-snug sm:text-xs">
              <AlertCircle className="mt-0.5 size-3 shrink-0 animate-pulse" />
              <span>
                {bindStatus === "fetching-params" && "Resolving referral code…"}
                {bindStatus === "signing" && "Check your wallet — sign to confirm…"}
                {bindStatus === "binding" && "Registering on-chain…"}
              </span>
            </p>
          )}
          {isBindSuccess && (
            <p className="text-green-600 flex flex-row items-start gap-1.5 text-2xs leading-snug sm:text-xs">
              <Check className="mt-0.5 size-3 shrink-0" />
              <span>Referral code applied successfully!</span>
            </p>
          )}
        </div>

        <Button variant="primary" size="action" className="min-h-12 text-base" onClick={handleGetStarted}>
          Get Started!
        </Button>
      </div>
    </div>
  );
}
