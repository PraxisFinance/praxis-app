"use client";

import { SettingsNotifications } from "./SettingsNotifications";
import { SettingsSupport } from "./SettingsSupport";
import { SettingsFaq } from "./SettingsFaq";

export function SettingsSubPage() {
  return (
    <div className="flex flex-col gap-6">
      <SettingsNotifications />
      <SettingsSupport />
      <SettingsFaq />
    </div>
  );
}
