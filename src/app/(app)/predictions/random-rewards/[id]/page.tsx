import { RandomPoolItemDetails } from "@/components/RandomRewards";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RandomPoolItemDetails poolId={id} />;
}
