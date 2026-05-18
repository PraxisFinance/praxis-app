"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Switch } from "@/components/ui/Switch";
import { NOTIFICATIONS_MOCK } from "@/shared/constants/profile";
import type { NotificationSetting } from "@/shared/types/profile";

interface SettingsNotificationsProps {
  initialSettings?: NotificationSetting[];
}

export function SettingsNotifications({
  initialSettings = NOTIFICATIONS_MOCK,
}: SettingsNotificationsProps) {
  const [settings, setSettings] = useState(initialSettings);

  function toggle(id: string) {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <SectionHeader>Notifications</SectionHeader>

      <div className="flex flex-col gap-2">
        {settings.map((setting) => (
          <div
            key={setting.id}
            className="flex items-center justify-between gap-4 rounded-sm bg-main-lightGray px-4 py-3"
          >
            <span className="text-main-darkPurple text-sm font-medium leading-5">
              {setting.label}
            </span>
            <Switch checked={setting.enabled} onCheckedChange={() => toggle(setting.id)} />
          </div>
        ))}
      </div>
    </section>
  );
}
