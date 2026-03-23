"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "all", label: "All", href: "/predictions/all" },
  { id: "cryptocurrency", label: "Cryptocurrency", href: "/predictions/cryptocurrency" },
  { id: "esports", label: "Esports", href: "/predictions/esports" },
  { id: "random-rewards", label: "Random Rewards", href: "/predictions/random-rewards" },
] as const;

export interface PredictionsTabBarProps {
  /** When true, shows a back arrow to the left of the tabs. */
  showBackButton?: boolean;
  /** Defaults to `router.back()` when omitted and the back button is shown. */
  onBack?: () => void;
}

export function PredictionsTabBar({ showBackButton = false, onBack }: PredictionsTabBarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleBack = () => {
    if (onBack) onBack();
    else router.back();
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {showBackButton && (
        <Button
          type="button"
          variant="secondaryBrand"
          size="icon-sm"
          className="shrink-0 rounded-[5px]"
          aria-label="Back"
          onClick={handleBack}
        >
          <ChevronLeft className="size-4" strokeWidth={2.25} />
        </Button>
      )}
      {TABS.map((tab) => {
        const isActive =
          pathname === tab.href ||
          (tab.id === "all" && pathname === "/predictions") ||
          (tab.id === "random-rewards" && pathname.startsWith("/predictions/random-rewards"));
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              "px-3 py-1.5 rounded-[5px] text-xs font-medium transition-all",
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
