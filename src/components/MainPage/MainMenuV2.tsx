import { SectionHeader } from "@/components/ui/SectionHeader";
import { MENU_ITEMS_V2 } from "@/shared/constants/main";
import { MenuCardV2 } from "./MenuCardV2";

export function MainMenuV2() {
  const largeItems = MENU_ITEMS_V2.filter((item) => item.type === "large");
  const middleItems = MENU_ITEMS_V2.filter((item) => item.type === "middle");

  return (
    <section>
      <SectionHeader className="mb-3">Application menu</SectionHeader>

      <div className="flex flex-col gap-3">
        {largeItems.map((item) => (
          <MenuCardV2
            key={item.key}
            size="lg"
            title={item.title}
            description={item.description}
            backgroundImage={item.backgroundImage}
            redirectUrl={item.redirectUrl}
            redirectLabel={item.redirectLabel}
            hubCategoryId={item.hubCategoryId}
            progressHubCategoryId={item.progressHubCategoryId}
          />
        ))}

        <div className="grid grid-cols-2 gap-3">
          {middleItems.map((item) => (
            <MenuCardV2
              key={item.key}
              title={item.title}
              description={item.description}
              backgroundImage={item.backgroundImage}
              redirectUrl={item.redirectUrl}
              redirectLabel={item.redirectLabel}
              hubCategoryId={item.hubCategoryId}
              progressHubCategoryId={item.progressHubCategoryId}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
