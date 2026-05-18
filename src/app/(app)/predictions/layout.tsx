import { Balances } from "@/components/Balances/Balances";
import { PredictionsTabBarHost } from "@/components/PredictionsPage/PredictionsTabBarHost";

export default function PredictionsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6">
      <Balances />
      <PredictionsTabBarHost />
      {children}
    </div>
  );
}
