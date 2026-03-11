"use client";

import { MenuCard } from "./ui/MenuCard";

interface MenuItem {
  id: string;
  label: string;
  imageUrl?: string;
  title?: string;
  description?: string;
  fullWidth?: boolean;
}

interface MenuGridProps {
  onItemClick?: (itemId: string) => void;
}

const menuItems: MenuItem[] = [
  {
    id: "how-it-works",
    label: "How it works",
    title: "Smart predictions",
    description: "Earning mechanism that combines yield and prediction market mechanics.",
    imageUrl: "/menu/how-it-works.png",
    fullWidth: true,
  },
  {
    id: "yield",
    label: "Yield",
    imageUrl: "/menu/yield.png",
  },
  {
    id: "random-distribution",
    label: "Random distribution",
    imageUrl: "/menu/random.png",
  },
  {
    id: "financial-predictions",
    label: "Financial predictions",
    imageUrl: "/menu/financial.png",
  },
  {
    id: "esport-predictions",
    label: "E-sport predictions",
    imageUrl: "/menu/esport.png",
  },
  {
    id: "invite-friends",
    label: "Invite friends",
    imageUrl: "/menu/invite.png",
  },
  {
    id: "leaderboard",
    label: "Leaderboard",
    imageUrl: "/menu/leaderboard.png",
  },
];

export function MenuGrid({ onItemClick }: MenuGridProps) {
  const howItWorks = menuItems.find(item => item.id === "how-it-works");
  const gridItems = menuItems.filter(item => item.id !== "how-it-works");

  return (
    <section>
      <h2 className="text-indigo-950 text-xl font-medium leading-6 mb-3">
        Application menu
      </h2>
      
      <div className="flex flex-col gap-3">
        {howItWorks && (
          <MenuCard
            label={howItWorks.label}
            imageUrl={howItWorks.imageUrl}
            title={howItWorks.title}
            description={howItWorks.description}
            fullWidth
            onClick={() => onItemClick?.(howItWorks.id)}
          />
        )}
        
        <div className="grid grid-cols-2 gap-3">
          {gridItems.map((item) => (
            <MenuCard
              key={item.id}
              label={item.label}
              imageUrl={item.imageUrl}
              onClick={() => onItemClick?.(item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
