import { Suspense } from "react";
import { ProgressPageContent } from "@/components/ProgressPage/ProgressPageContent";
import { PageSkeleton } from "@/components/ui/skeleton";

export default function ProgressPage() {
  return (
    <Suspense fallback={<PageSkeleton variant="list" rows={4} />}>
      <ProgressPageContent />
    </Suspense>
  );
}
