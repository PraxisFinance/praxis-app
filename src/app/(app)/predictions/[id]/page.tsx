import { PredictionsHubDetailRoutePage } from "@/components/PredictionsPage/details/PredictionsHubDetailRoutePage";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PredictionsHubDetailRoutePage id={id} />;
}
