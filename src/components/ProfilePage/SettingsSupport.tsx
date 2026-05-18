import { Headphones } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/button";

export function SettingsSupport() {
  return (
    <section className="flex flex-col gap-3">
      <SectionHeader>Support</SectionHeader>

      <Button variant="primary" size="action">
        <Headphones className="size-4" />
        Write to support
      </Button>
    </section>
  );
}
