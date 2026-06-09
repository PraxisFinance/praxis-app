import { Suspense } from "react";
import { PredictionsPageContent } from "@/components/PredictionsPage/PredictionsPageContent";

export default function PredictionsPage() {
  return (
    <Suspense>
      <PredictionsPageContent />
    </Suspense>
  );
}
