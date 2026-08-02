"use client";

import { Balances } from "@/components/Balances/Balances";
import { MainMenuV2 } from "./MainMenuV2";

export function MainPage() {
  return (
    <div className="flex flex-col gap-6">
      <Balances />
      <MainMenuV2 />
    </div>
  );
}
