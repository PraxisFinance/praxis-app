"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertCircle, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ArrowIcon } from "@/components/ui";
import { formatScore } from "@/stores";
import { PraxisBtnIcon } from "@/components/icons/brand/praxisBtnIcon";
import { useReferral } from "@/hooks/useReferral";
import { shortenAddress } from "@/stores/rydStore";

export function InviteFriendsPage() {
  const router = useRouter();
  const { stats, statsLoading, bindCode, resetBind, bindStatus, bindError } = useReferral();

  const [enteredReferralLink, setEnteredReferralLink] = useState("");
  const [copied, setCopied] = useState(false);

  const isBindPending = bindStatus === "fetching-params" || bindStatus === "signing" || bindStatus === "binding";
  const isBindSuccess = bindStatus === "success";

  const referralUrl = stats?.code ? `https://base.praxis.cc/r/${stats.code}` : "";

  async function handleCopy() {
    if (!referralUrl) return;
    await navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleBind() {
    const code = enteredReferralLink.trim().split("/").pop() ?? "";
    if (!code) return;
    const result = await bindCode(code);
    if (result) setEnteredReferralLink("");
  }

  function handleBindInputChange(value: string) {
    setEnteredReferralLink(value);
    if (bindStatus === "error") resetBind();
  }

  const inputClassName =
    "bg-main-lightGray text-main-darkPurple placeholder:text-main-darkPurple/45 " +
    "min-h-12 min-w-0 flex-1 rounded-lg px-3 py-2 text-sm leading-normal outline-none sm:px-4 sm:text-base";

  const actionButtonClassName =
    "bg-main-purple text-white flex size-12 shrink-0 items-center justify-center rounded-lg";

  return (
    <div className="flex min-h-full flex-col gap-5 pb-8">
      <div className="flex flex-row flex-wrap items-center gap-2.5">
        <Button variant="pillPrimary" size="pill" onClick={() => router.back()}>
          <ArrowIcon className="h-4 w-4 rotate-180" />
          Back
        </Button>

        <Button variant="pillSecondary" size="pill" onClick={() => router.push("/main")}>
          Main menu
        </Button>
      </div>

      <section className="bg-main-lightGray relative min-h-28 overflow-hidden rounded-lg px-3 py-4 sm:min-h-32 sm:px-4">
        <Image
          src="/invite-friends/card-bg.png"
          alt=""
          fill
          className="object-cover object-right"
          sizes="(max-width: 28rem) 100vw, 28rem"
          priority
        />
        <div className="relative z-10 flex min-w-0 max-w-[65%] flex-col justify-center gap-2">
          <h1 className="text-main-darkPurple text-2xl font-medium leading-tight sm:text-3xl">
            Invite Friends
          </h1>
          <p className="text-main-darkPurple text-sm leading-snug sm:text-base">
            You can get more YT by inviting your friends to play with you.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <SectionHeader className="text-main-darkPurple">Referral link</SectionHeader>

        <div className="flex flex-row items-stretch gap-2">
          <Input
            readOnly
            value={referralUrl}
            placeholder={statsLoading ? "Loading…" : "Your referral link"}
            className={inputClassName}
          />
          <button
            type="button"
            className={actionButtonClassName}
            aria-label="Copy referral link"
            onClick={handleCopy}
            disabled={!referralUrl}
          >
            {copied ? <Check className="size-5 shrink-0" /> : <Copy className="size-5 shrink-0" />}
          </button>
        </div>
        <p className="text-main-darkPurple/90 flex flex-row items-start gap-1.5 text-2xs leading-snug sm:text-xs">
          <AlertCircle className="mt-0.5 size-3 shrink-0" />
          <span>
            You can invite your friends to play with you and get bonus from each joined friend
          </span>
        </p>

        <div className="mt-1 flex flex-col gap-1.5">
          <div className="flex flex-row items-stretch gap-2">
            <Input
              value={enteredReferralLink}
              onChange={(event) => handleBindInputChange(event.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleBind()}
              placeholder="Enter referral link or code"
              className={inputClassName}
              disabled={isBindSuccess || isBindPending}
            />
            <button
              type="button"
              className={actionButtonClassName}
              aria-label="Apply referral code"
              onClick={handleBind}
              disabled={!enteredReferralLink.trim() || isBindSuccess || isBindPending}
            >
              <Check className="size-5 shrink-0" />
            </button>
          </div>
          {bindError && (
            <p className="text-red-500 flex flex-row items-start gap-1.5 text-2xs leading-snug sm:text-xs">
              <AlertCircle className="mt-0.5 size-3 shrink-0" />
              <span>{bindError}</span>
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
          {!bindError && !isBindPending && !isBindSuccess && (
            <p className="text-main-darkPurple/90 flex flex-row items-start gap-1.5 text-2xs leading-snug sm:text-xs">
              <AlertCircle className="mt-0.5 size-3 shrink-0" />
              <span>When using your friend&apos;s referral link, you and he receive bonuses.</span>
            </p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <SectionHeader className="text-main-darkPurple">
          Your friends
          {stats && (stats.pendingCount > 0 || stats.qualifiedCount > 0) && (
            <span className="text-main-darkPurple/60 ml-2 text-sm font-normal">
              {stats.qualifiedCount} qualified · {stats.pendingCount} pending
            </span>
          )}
        </SectionHeader>

        {statsLoading && (
          <p className="text-main-darkPurple/60 text-sm">Loading…</p>
        )}

        {!statsLoading && stats?.referees.length === 0 && (
          <p className="text-main-darkPurple/60 text-sm">
            No referrals yet. Share your link to invite friends!
          </p>
        )}

        <ul className="flex flex-col gap-2.5">
          {stats?.referees.map((referee) => (
            <li
              key={referee.address}
              className="bg-main-lightGray flex flex-row items-center gap-3 rounded-lg px-3 py-2"
            >
              <div className="flex min-w-0 flex-1 flex-row items-center gap-2.5">
                <div className="bg-main-purple/40 size-8 shrink-0 rounded-full" />
                <div className="flex min-w-0 flex-col">
                  <span className="text-main-darkPurple truncate text-sm font-medium leading-normal sm:text-base">
                    {shortenAddress(referee.address)}
                  </span>
                  <span className="text-main-darkPurple/50 text-2xs capitalize leading-none sm:text-xs">
                    {referee.status}
                  </span>
                </div>
              </div>
              {referee.points != null && (
                <div className="text-main-darkPurple flex min-w-[5.75rem] max-w-[7.5rem] shrink-0 flex-row items-center justify-start gap-2 text-left text-sm font-medium tabular-nums leading-normal sm:min-w-[6.5rem] sm:text-base">
                  <span className="inline-flex shrink-0" aria-hidden>
                    <PraxisBtnIcon />
                  </span>
                  <span className="min-w-0">{formatScore(referee.points)}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
