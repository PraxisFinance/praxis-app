"use client";

import { Drawer } from "vaul";

interface DrawerShellProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function DrawerShell({ open, onOpenChange, children }: DrawerShellProps) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[60]" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-[70] max-w-md mx-auto bg-main-lightGray rounded-t-3xl outline-none">
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-main-grayPurple" />
          </div>

          <div className="px-5 pt-4 pb-10 flex flex-col gap-6">{children}</div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
