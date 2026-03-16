import { LargeMenuCard } from "./LargeMenuCard";
import { MenuCard } from "./MenuCard";

type MenuItemType = "large" | "middle";

interface MenuItem {
  type: MenuItemType;
  title?: string;
  description?: string;
  backgroundImage?: string;
  redirectUrl?: string;
  redirectLabel?: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    type: "large",
    title: "Smart predictions",
    description: "Earning mechanism that combines yield and prediction market mechanics.",
    backgroundImage: "/main/smart-predictions.png",
    redirectUrl: "",
    redirectLabel: "How it works",
  },
  {
    type: "middle",
    backgroundImage: "/main/yield.png",
    redirectUrl: "",
    redirectLabel: "Yield",
  },
  {
    type: "middle",
    backgroundImage: "/main/random-distribution.png",
    redirectUrl: "",
    redirectLabel: "Random distribution",
  },
  {
    type: "middle",
    backgroundImage: "/main/financial-predictions.png",
    redirectUrl: "",
    redirectLabel: "Financial predictions",
  },
  {
    type: "middle",
    backgroundImage: "/main/e-sports-predictions.png",
    redirectUrl: "",
    redirectLabel: "E-sport predictions",
  },
  {
    type: "middle",
    backgroundImage: "/main/invite-friends.png",
    redirectUrl: "",
    redirectLabel: "Invite friends",
  },
  {
    type: "middle",
    backgroundImage: "/main/leaderboard.png",
    redirectUrl: "",
    redirectLabel: "Leaderboard",
  },
];

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
            key={item.title}
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
