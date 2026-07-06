"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getDevAuthToken } from "@/lib/auth/devAuthToken";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";
const JWT_STORAGE_KEY = "praxis_auth_token";

// ─── JWT helpers ─────────────────────────────────────────────────────────────

function readStoredJwt(): { token: string; source: string } | null {
  const fake = process.env.NEXT_PUBLIC_FAKE_JWT;
  if (fake) return { token: fake, source: "NEXT_PUBLIC_FAKE_JWT" };

  const dev = getDevAuthToken();
  if (dev) return { token: dev, source: "NEXT_PUBLIC_DEV_AUTH_TOKEN" };

  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(JWT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { token?: string };
    if (parsed.token) return { token: parsed.token, source: "localStorage" };
  } catch {
    // ignore parse errors
  }
  return null;
}

function decodeJwtPayload(jwt: string): Record<string, unknown> | null {
  try {
    const parts = jwt.split(".");
    if (parts.length !== 3) return null;
    const pad = parts[1].length % 4;
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/") + "=".repeat(pad ? 4 - pad : 0);
    return JSON.parse(atob(b64)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback: do nothing
    }
  }, [value]);

  return (
    <Button variant="secondaryBrand" size="xs" onClick={handleCopy} className="shrink-0">
      {copied ? "Copied!" : "Copy"}
    </Button>
  );
}

interface DataRowProps {
  label: string;
  value: string | null | undefined;
  mono?: boolean;
  truncate?: boolean;
}

function DataRow({ label, value, mono = false, truncate = false }: DataRowProps) {
  const display = value ?? "—";
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</span>
      <div className="flex items-start gap-2">
        <span
          className={[
            "flex-1 break-all text-sm text-slate-800",
            mono ? "font-mono" : "",
            truncate ? "line-clamp-2" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {display}
        </span>
        {value && <CopyButton value={value} />}
      </div>
    </div>
  );
}

interface JsonBlockProps {
  label: string;
  data: unknown;
  loading?: boolean;
  error?: string | null;
  onFetch: () => void;
}

function JsonBlock({ label, data, loading, error, onFetch }: JsonBlockProps) {
  const json = data !== null && data !== undefined ? JSON.stringify(data, null, 2) : null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <SectionHeader className="text-base">{label}</SectionHeader>
        <Button variant="primary" size="xs" onClick={onFetch} disabled={loading}>
          {loading ? "Loading…" : "Fetch"}
        </Button>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 font-mono">{error}</p>
      )}

      {json && (
        <div className="relative">
          <div className="absolute right-2 top-2 z-10">
            <CopyButton value={json} />
          </div>
          <pre className="overflow-auto rounded-lg bg-slate-50 border border-slate-200 p-3 pt-8 text-xs text-slate-700 font-mono max-h-64">
            {json}
          </pre>
        </div>
      )}

      {!json && !error && !loading && (
        <p className="text-sm text-slate-400 italic">Press Fetch to load</p>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function DebugPage() {
  const { address } = useAccount();

  const [jwtInfo, setJwtInfo] = useState<{ token: string; source: string } | null>(null);
  const [jwtPayload, setJwtPayload] = useState<Record<string, unknown> | null>(null);

  const [achievementsData, setAchievementsData] = useState<unknown>(null);
  const [achievementsLoading, setAchievementsLoading] = useState(false);
  const [achievementsError, setAchievementsError] = useState<string | null>(null);

  const [historyData, setHistoryData] = useState<unknown>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  useEffect(() => {
    const info = readStoredJwt();
    setJwtInfo(info);
    if (info) setJwtPayload(decodeJwtPayload(info.token));
  }, []);

  const jwtAddress = (jwtPayload?.sub as string) ?? null;

  const fetchAchievements = useCallback(async () => {
    if (!jwtInfo?.token) {
      setAchievementsError("No JWT available — connect wallet first");
      return;
    }
    setAchievementsLoading(true);
    setAchievementsError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/achievements/me`, {
        headers: { Authorization: `Bearer ${jwtInfo.token}` },
      });
      const body: unknown = await res.json();
      if (!res.ok) {
        setAchievementsError(`HTTP ${res.status}: ${JSON.stringify(body)}`);
      } else {
        setAchievementsData(body);
      }
    } catch (e) {
      setAchievementsError(e instanceof Error ? e.message : String(e));
    } finally {
      setAchievementsLoading(false);
    }
  }, [jwtInfo]);

  const fetchHistory = useCallback(async () => {
    if (!jwtInfo?.token) {
      setHistoryError("No JWT available — connect wallet first");
      return;
    }
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/user-history`, {
        headers: { Authorization: `Bearer ${jwtInfo.token}` },
      });
      const body: unknown = await res.json();
      if (!res.ok) {
        setHistoryError(`HTTP ${res.status}: ${JSON.stringify(body)}`);
      } else {
        setHistoryData(body);
      }
    } catch (e) {
      setHistoryError(e instanceof Error ? e.message : String(e));
    } finally {
      setHistoryLoading(false);
    }
  }, [jwtInfo]);

  return (
    <div className="flex flex-col gap-6 pb-6">
      <SectionHeader>Debug</SectionHeader>

      {/* Auth info */}
      <section className="flex flex-col gap-4 rounded-xl bg-white border border-slate-100 shadow-sm p-4">
        <h3 className="text-sm font-semibold text-slate-600">Auth</h3>

        <DataRow label="Wallet address" value={address} mono />

        <DataRow
          label={`JWT${jwtInfo ? ` (source: ${jwtInfo.source})` : ""}`}
          value={jwtInfo?.token}
          mono
          truncate
        />

        <DataRow label="JWT address (sub)" value={jwtAddress} mono />

        {jwtPayload && (
          <DataRow
            label="JWT exp"
            value={
              jwtPayload.exp
                ? new Date((jwtPayload.exp as number) * 1000).toISOString()
                : null
            }
          />
        )}
      </section>

      {/* Achievements response */}
      <section className="rounded-xl bg-white border border-slate-100 shadow-sm p-4">
        <JsonBlock
          label="Achievements (/achievements/me)"
          data={achievementsData}
          loading={achievementsLoading}
          error={achievementsError}
          onFetch={fetchAchievements}
        />
      </section>

      {/* Profile (user-history) response */}
      <section className="rounded-xl bg-white border border-slate-100 shadow-sm p-4">
        <JsonBlock
          label="Profile (/user-history)"
          data={historyData}
          loading={historyLoading}
          error={historyError}
          onFetch={fetchHistory}
        />
      </section>
    </div>
  );
}
