import { notFound } from "next/navigation";
import { PredictionsHubDetailRoutePage } from "@/components/PredictionsPage/details/PredictionsHubDetailRoutePage";
import { findPredictionsHubItemById } from "@/shared/constants/predictionsHubCards";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = findPredictionsHubItemById(id);

  if (!item) {
    notFound();
  }

  return <PredictionsHubDetailRoutePage item={item} />;
}
