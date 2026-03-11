"use client";

import { HomeIcon, EarnIcon, PredictionsIcon, HistoryIcon, ProfileIcon } from "./ui/icons/NavIcons";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; active?: boolean }>;
}

const navItems: NavItem[] = [
  { id: "main", label: "Main", icon: HomeIcon },
  { id: "earn", label: "Earn", icon: EarnIcon },
  { id: "predictions", label: "Predictions", icon: PredictionsIcon },
  { id: "history", label: "History", icon: HistoryIcon },
  { id: "profile", label: "Profile", icon: ProfileIcon },
];

interface BottomNavProps {
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

export function BottomNav({ activeTab = "main", onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-md mx-auto bg-white rounded-t-[10px] shadow-[0px_-10px_20px_0px_rgba(218,216,230,0.50)]">
        <div className="flex justify-around items-center h-16 px-4">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange?.(item.id)}
                className="flex flex-col items-center gap-1 min-w-[48px] transition-colors"
              >
                <Icon className="w-6 h-6" active={isActive} />
                <span className={`text-xs leading-4 ${
                  isActive ? "text-violet-400 font-medium" : "text-indigo-950 font-normal"
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
