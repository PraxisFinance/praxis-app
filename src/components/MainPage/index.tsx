"use client";

import Link from "next/link";
import { Balances } from "@/components/Balances/Balances";
import { MainMenu } from "./MainMenu";
import { DEBUG_ROUTE } from "@/lib/routes";

export function MainPage() {
  return (
    <div className="flex flex-col gap-6">
      <Balances />
      <MainMenu />
      <Link
        href={DEBUG_ROUTE}
        className="self-center text-xs text-slate-400 underline underline-offset-2 hover:text-slate-600 transition-colors"
      >
        Debug
      </Link>
    </div>
  );
}
