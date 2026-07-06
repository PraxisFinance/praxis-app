"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isProfileSubTabActive, type ProfileTabId } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { BalancesIcon } from "@/components/icons/feature/profile/balancesIcon";
import { RewardsIcon } from "@/components/icons/feature/profile/rewardsIcon";
import { DepositsIcon } from "@/components/icons/feature/profile/depositsIcon";
import { PredictionsIcon } from "@/components/icons/feature/profile/predictionsIcon";
import { SettingsIcon } from "@/components/icons/feature/profile/settingsIcon";

const TABS = [
  { id: "balances", label: "Balances", href: "/profile/balances", icon: BalancesIcon },
  { id: "rewards", label: "Rewards", href: "/profile/rewards", icon: RewardsIcon },
  { id: "deposits", label: "Deposits", href: "/profile/deposits", icon: DepositsIcon },
  { id: "predictions", label: "Predictions", href: "/profile/predictions", icon: PredictionsIcon },
  { id: "settings", label: "Settings", href: "/profile/settings", icon: SettingsIcon },
] as const;

export function ProfileTabBar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap items-center gap-2">
      {TABS.map((tab) => {
        const isActive = isProfileSubTabActive(tab.id as ProfileTabId, pathname);
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium transition-all",
              isActive
                ? "bg-main-purple text-white"
                : "bg-main-lightGray text-main-darkPurple hover:bg-main-grayPurple"
            )}
          >
            <tab.icon size={24} />
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
