import { ProfileTabBar } from "@/components/ProfilePage";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <ProfileTabBar />
      {children}
    </div>
  );
}
