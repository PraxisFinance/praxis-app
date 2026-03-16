"use client";

import { Balances } from "@/components/Balances";
import { MenuGrid } from "@/components/MenuGrid";
import { MainMenu } from "./MainMenu";

export function MainPage() {

  return (
    <div className="flex flex-col gap-6">
      <Balances />
      <MainMenu />
    </div>
  );
}
