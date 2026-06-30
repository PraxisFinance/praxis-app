"use client";

import { useRouter } from "next/navigation";

import { HISTORY_ROUTE } from "@/lib/routes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SettingsIcon, NotificationIcon } from "@/components/icons/navigation";
import { UsdcTokenIcon, WUsdcTokenIcon } from "@/components/icons/base";

interface HeaderProps {
  username: string;
  avatarUrl?: string;
  points?: number;
}

export function Header({ username, avatarUrl, points = 0 }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="flex justify-between items-center">
      <div className="flex items-center gap-[5px]">
        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
          {avatarUrl ? (
            <img className="w-full h-full object-cover" src={avatarUrl} alt={username} />
          ) : (
            <div className="w-full h-full bg-violet-400 flex items-center justify-center text-white font-medium">
              {username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <span className="text-indigo-950 text-lg font-medium leading-5">@{username}</span>
      </div>

      <div className="flex items-center gap-2.5">
        <Badge variant="neutral" className="text-sm leading-4">
          {points.toLocaleString("en-US")}
          <span className="inline-flex shrink-0" aria-hidden>
            <UsdcTokenIcon size={18} />
          </span>
        </Badge>

        <Button variant="iconPill" size="icon" onClick={() => router.push(HISTORY_ROUTE)}>
          <NotificationIcon className="w-4 h-4" />
        </Button>

        <Button
          variant="iconPill"
          size="icon"
          type="button"
          aria-label="Open settings"
          onClick={() => router.push("/profile/settings")}
        >
          <SettingsIcon className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
