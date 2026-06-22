import { Suspense } from "react";
import { HistoryBoot } from "@/components/HistoryBoot";
import { ProgressPageContent } from "@/components/ProgressPage/ProgressPageContent";

export default function ProgressPage() {
  return (
    <>
      <HistoryBoot />
      <Suspense>
        <ProgressPageContent />
      </Suspense>
    </>
  );
}
