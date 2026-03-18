import { LargeMenuCard } from "./LargeMenuCard";
import { MenuCard } from "./MenuCard";
import { MENU_ITEMS } from "@/shared/constants/main";

export function MainMenu() {
  const largeItems = MENU_ITEMS.filter((item) => item.type === "large");
  const middleItems = MENU_ITEMS.filter((item) => item.type === "middle");

  return (
    <section>
      <h2 className="text-indigo-950 text-xl font-medium leading-6 mb-3">
        Application menu
      </h2>

      <div className="flex flex-col gap-3">
        {largeItems.map((item) => (
          <LargeMenuCard
            key={item.key}
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
              key={item.title}
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
