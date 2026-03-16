"use client";

import { Balances } from "@/components/Balances";
import { MenuGrid } from "@/components/MenuGrid";

export function MainPage() {
  const handleMenuItemClick = (itemId: string) => {
    console.log("Menu item clicked:", itemId);
  };

  return (
    <div className="flex flex-col gap-6">
      <Balances />
      <MenuGrid onItemClick={handleMenuItemClick} />
    </div>
  );
}
