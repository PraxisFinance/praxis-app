import { notFound } from "next/navigation";
import { TwoPoolPage } from "@/components/TwoPoolPage";
import { fetchTwoPoolStates } from "@/shared/api/twoPoolEnvio";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pools = await fetchTwoPoolStates();
  const pool = pools.find((p) => p.id === decodeURIComponent(id));
  if (!pool) notFound();
  return <TwoPoolPage pool={pool} />;
}
