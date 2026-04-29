import { notFound } from "next/navigation";
import { TwoPoolPage } from "@/components/TwoPoolPage";
import { getTwoPoolById } from "@/shared/constants/twoPoolMocks";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pool = getTwoPoolById(id);
  if (!pool) notFound();
  return <TwoPoolPage pool={pool} />;
}
