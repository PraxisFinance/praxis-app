"use client";

import Link from "next/link";
import { SettingsNotifications } from "./SettingsNotifications";
import { SettingsSupport } from "./SettingsSupport";
import { SettingsFaq } from "./SettingsFaq";
import { DEBUG_ROUTE } from "@/lib/routes";

export function SettingsSubPage() {
  return (
    <div className="flex flex-col gap-6">
      <SettingsNotifications />
      <SettingsSupport />
      <SettingsFaq />
      <Link
        href={DEBUG_ROUTE}
        className="self-center text-xs text-slate-400 underline underline-offset-2 hover:text-slate-600 transition-colors"
      >
        Debug
      </Link>
    </div>
  );
}
