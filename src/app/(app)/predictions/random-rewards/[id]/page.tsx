import { RandomPoolItemDetails } from "@/components/PredictionsPage/RandomPoolItemDetails";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RandomPoolItemDetails poolId={id} />;
}
