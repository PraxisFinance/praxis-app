"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  isPredictionsSectionPath,
  isProfileSectionPath,
  isProgressSectionPath,
  PREDICTIONS_ROUTE,
  PROGRESS_ROUTE,
} from "@/lib/routes";
import { HomeIcon, EarnIcon, PredictionsIcon, ProgressIcon, ProfileIcon } from "@/components/icons/navigation";

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; active?: boolean }>;
}

const navItems: NavItem[] = [
  { id: "main", label: "Main", href: "/main", icon: HomeIcon },
  { id: "earn", label: "Earn", href: "/earn", icon: EarnIcon },
  { id: "predictions", label: "Predictions", href: PREDICTIONS_ROUTE, icon: PredictionsIcon },
  { id: "progress", label: "Progress", href: PROGRESS_ROUTE, icon: ProgressIcon },
  { id: "profile", label: "Profile", href: "/profile", icon: ProfileIcon },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-md mx-auto bg-white rounded-t-[10px] shadow-[0px_-10px_20px_0px_rgba(218,216,230,0.50)]">
        <div className="flex justify-around items-center h-16 px-4">
          {navItems.map((item) => {
            const isActive =
              item.id === "predictions"
                ? isPredictionsSectionPath(pathname)
                : item.id === "progress"
                  ? isProgressSectionPath(pathname)
                  : item.id === "profile"
                    ? isProfileSectionPath(pathname)
                    : pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className="flex flex-col items-center gap-1 min-w-[48px] transition-colors"
              >
                <Icon className="w-6 h-6" active={isActive} />
                <span
                  className={`text-xs leading-4 ${
                    isActive ? "text-violet-400 font-medium" : "text-indigo-950 font-normal"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
