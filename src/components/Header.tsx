"use client";

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
            <img 
              className="w-full h-full object-cover" 
              src={avatarUrl} 
              alt={username} 
            />
          ) : (
            <div className="w-full h-full bg-violet-400 flex items-center justify-center text-white font-medium">
              {username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <span className="text-indigo-950 text-lg font-medium leading-5">
          @{username}
        </span>
      </div>
      
      <div className="flex items-center gap-2.5">
        <div className="px-2.5 py-[5px] bg-slate-200 rounded-[30px] flex items-center gap-[5px]">
          <span className="text-indigo-950 text-sm font-medium leading-4">
            {points.toLocaleString()}
          </span>
          <div className="w-4 h-4 rounded-full bg-violet-400" />
        </div>
        
        <button className="p-[5px] bg-slate-200 rounded-[30px] flex items-center justify-center hover:bg-slate-300 transition-colors">
          <NotificationIcon className="w-4 h-4" />
        </button>
        
        <button className="p-[5px] bg-slate-200 rounded-[30px] flex items-center justify-center hover:bg-slate-300 transition-colors">
          <SettingsIcon className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
