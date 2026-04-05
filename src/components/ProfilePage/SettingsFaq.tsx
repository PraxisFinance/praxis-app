"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/button";
import { FAQ_ITEMS } from "@/shared/constants/profile";
import type { FaqItem } from "@/shared/types/profile";

interface SettingsFaqProps {
  items?: FaqItem[];
}

export function SettingsFaq({ items = FAQ_ITEMS }: SettingsFaqProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <section className="flex flex-col gap-3">
      <SectionHeader>FAQ</SectionHeader>

      <div className="flex flex-col gap-2">
        {items.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div key={item.id} className="overflow-hidden rounded-sm bg-main-lightGray">
              <button
                type="button"
                onClick={() => toggle(item.id)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
              >
                <span className="text-main-darkPurple text-sm font-medium leading-5">
                  {item.question}
                </span>
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-main-darkPurple/50 transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-3">
                  <p className="text-main-darkPurple/70 text-sm leading-5">{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Button variant="primary" size="action">
        How it works
      </Button>
    </section>
  );
}
