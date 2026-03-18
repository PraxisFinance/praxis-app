import { Balances } from "../Balances/Balances";
import { EarnAvailableCard } from "./EarnAvailableCard";
import { EarnMyPositionsCard } from "./EarnMyPositionsCard";
import { EARN_AVAILABLE_ITEMS, EARN_MY_POSITIONS } from "@/shared/constants/earn";

export function EarnPage() {
  return (
    <div className="flex flex-col gap-6">
      <Balances />
      <section className="flex flex-col gap-3">
        <h2 className="text-indigo-950 text-xl font-medium leading-6">My positions</h2>
        <div className="flex flex-col gap-3">
          {EARN_MY_POSITIONS.map((item) => (
            <EarnMyPositionsCard key={`${item.queueName}-${item.stakeDate}`} item={item} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-indigo-950 text-xl font-medium leading-6">Available pools</h2>
        <div className="flex flex-col gap-3">
          {EARN_AVAILABLE_ITEMS.map((item) => (
            <EarnAvailableCard key={item.queueName} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
