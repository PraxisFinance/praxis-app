"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isProfileSubTabActive, type ProfileTabId } from "@/lib/routes";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "balances", label: "Balances", href: "/profile/balances" },
  { id: "rewards", label: "Rewards", href: "/profile/rewards" },
  { id: "deposits", label: "Deposits", href: "/profile/deposits" },
  { id: "predictions", label: "Predictions", href: "/profile/predictions" },
  { id: "settings", label: "Settings", href: "/profile/settings" },
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
              "px-3 py-1.5 rounded-sm text-xs font-medium transition-all",
              isActive
                ? "bg-main-purple text-white"
                : "bg-main-lightGray text-main-darkPurple hover:bg-main-grayPurple"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
