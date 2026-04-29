import { notFound } from "next/navigation";
import { TwoPoolPage } from "@/components/TwoPoolPage";
import { useTwoPoolsStore } from "@/stores/twoPoolsStore";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pool = useTwoPoolsStore.getState().getPoolById(id);
  if (!pool) notFound();
  return <TwoPoolPage pool={pool} />;
}
