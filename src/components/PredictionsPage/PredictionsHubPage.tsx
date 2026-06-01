"use client";

import { MenuCard } from "@/components/ui/MenuCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PREDICTIONS_MENU_ITEMS } from "@/shared/constants/predictionsMenu";

export function PredictionsHubPage() {
  const largeItems = PREDICTIONS_MENU_ITEMS.filter((item) => item.type === "large");
  const middleItems = PREDICTIONS_MENU_ITEMS.filter((item) => item.type === "middle");

  return (
    <section>
      <SectionHeader className="mb-3">Predictions</SectionHeader>

      <div className="flex flex-col gap-3">
        {largeItems.map((item) => (
          <MenuCard
            key={item.key}
            size="lg"
            title={item.title}
            description={item.description}
            backgroundImage={item.backgroundImage}
            redirectUrl={item.redirectUrl}
            redirectLabel={item.redirectLabel}
          />
        ))}

        <div className="grid grid-cols-2 gap-3">
          {middleItems.map((item) => (
            <MenuCard
              key={item.key}
              backgroundImage={item.backgroundImage}
              redirectUrl={item.redirectUrl}
              redirectLabel={item.redirectLabel}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
