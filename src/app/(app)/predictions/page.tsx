import { Suspense } from "react";
import { PredictionsPageContent } from "@/components/PredictionsPage/PredictionsPageContent";
import { PageSkeleton } from "@/components/ui/skeleton";

export default function PredictionsPage() {
  return (
    <Suspense fallback={<PageSkeleton variant="hub" rows={4} />}>
      <PredictionsPageContent />
    </Suspense>
  );
}
