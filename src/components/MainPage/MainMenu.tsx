import { MenuCard } from "@/components/ui/MenuCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MENU_ITEMS } from "@/shared/constants/main";

export function MainMenu() {
  const largeItems = MENU_ITEMS.filter((item) => item.type === "large");
  const middleItems = MENU_ITEMS.filter((item) => item.type === "middle");

  return (
    <section>
      <SectionHeader className="mb-3">Application menu</SectionHeader>

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
              title={item.title}
              description={item.description}
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
