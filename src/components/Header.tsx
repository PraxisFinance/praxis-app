"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SettingsIcon, NotificationIcon } from "./ui/icons/NavIcons";

interface HeaderProps {
  username: string;
  avatarUrl?: string;
  points?: number;
}

export function Header({ username, avatarUrl, points = 0 }: HeaderProps) {
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
          {points.toLocaleString()}
          <div className="w-4 h-4 rounded-full bg-violet-400" />
        </Badge>

        <Button variant="iconPill" size="icon">
          <NotificationIcon className="w-4 h-4" />
        </Button>

        <Button variant="iconPill" size="icon">
          <SettingsIcon className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
