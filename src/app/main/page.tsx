"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Balances } from "@/components/Balances";
import { MenuGrid } from "@/components/MenuGrid";
import { BottomNav } from "@/components/BottomNav";

export default function MainPage() {
  const [activeTab, setActiveTab] = useState("main");

  const handleMenuItemClick = (itemId: string) => {
    console.log("Menu item clicked:", itemId);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    console.log("Tab changed:", tabId);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto px-5 pt-7 pb-20">
        <div className="flex flex-col gap-6">
          <Header 
            username="Mizori_k" 
            points={1000}
          />
          
          <Balances />
          
          <MenuGrid onItemClick={handleMenuItemClick} />
        </div>
      </div>

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
