"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import type { RandomPoolUserInPool } from "@/shared/types/randomPool";
import { RandomPoolUserRow } from "./RandomPoolUserRow";

export interface RandomPoolParticipantListProps {
  title: string;
  users: RandomPoolUserInPool[];
}

export function RandomPoolParticipantList({ title, users }: RandomPoolParticipantListProps) {
  return (
    <section className="flex flex-col gap-3">
      <SectionHeader className="text-main-darkPurple text-lg font-bold leading-6">{title}</SectionHeader>
      <ul className="flex flex-col gap-2">
        {users.map((u) => (
          <RandomPoolUserRow key={`${u.username}-${u.amount}`} user={u} />
        ))}
      </ul>
    </section>
  );
}
