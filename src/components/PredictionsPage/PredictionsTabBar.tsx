"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "all", label: "All", href: "/predictions/all" },
  { id: "cryptocurrency", label: "Cryptocurrency", href: "/predictions/cryptocurrency" },
  { id: "esports", label: "Esports", href: "/predictions/esports" },
  { id: "random-rewards", label: "Random Rewards", href: "/predictions/random-rewards" },
] as const;

export function PredictionsTabBar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap gap-2">
      {TABS.map((tab) => {
        const isActive = pathname === tab.href || (tab.id === "all" && pathname === "/predictions");
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              "px-3 py-1.5 rounded-[30px] text-sm font-medium transition-all",
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
