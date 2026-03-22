import { PredictionsTabBar } from "@/components/PredictionsPage/PredictionsTabBar";

export default function PredictionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <PredictionsTabBar />
      {children}
    </div>
  );
}
