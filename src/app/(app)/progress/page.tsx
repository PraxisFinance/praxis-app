import { Suspense } from "react";
import { ProgressPageContent } from "@/components/ProgressPage/ProgressPageContent";

export default function ProgressPage() {
  return (
    <Suspense>
      <ProgressPageContent />
    </Suspense>
  );
}
