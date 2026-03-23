"use client";

interface RandomPoolItemDetailsProps {
  poolId: string;
}

export function RandomPoolItemDetails({ poolId }: RandomPoolItemDetailsProps) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-main-darkPurple text-xl font-bold leading-tight">Random pool</h1>
      <p className="text-main-darkPurple/70 text-sm">Pool ID: {poolId}</p>
      <div className="bg-main-lightGray text-main-darkPurple/60 flex min-h-[200px] items-center justify-center rounded-2xl px-4 py-8 text-center text-sm">
        Content placeholder
      </div>
    </div>
  );
}
