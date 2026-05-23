import { ProfileTabBar } from "@/components/ProfilePage";
import { HistoryBoot } from "@/components/HistoryBoot";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <HistoryBoot />
      <ProfileTabBar />
      {children}
    </div>
  );
}
