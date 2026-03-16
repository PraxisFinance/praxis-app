import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="max-w-md w-full mx-auto flex flex-col flex-1">
        <header className="px-5 pt-7 pb-0 shrink-0">
          <Header username="Mizori_k" points={1000} />
        </header>

        <main className="flex-1 px-5 pt-6 pb-24 overflow-y-auto">
          {children}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
