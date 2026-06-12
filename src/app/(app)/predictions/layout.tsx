import { PredictionsHubLayoutShell } from "@/components/PredictionsPage/PredictionsHubLayoutShell";

export default function PredictionsLayout({ children }: { children: React.ReactNode }) {
  return (
    <PredictionsHubLayoutShell>
      <div className="flex flex-col gap-6">{children}</div>
    </PredictionsHubLayoutShell>
  );
}
