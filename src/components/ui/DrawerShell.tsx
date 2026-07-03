"use client";

import { Drawer } from "vaul";
import { cn } from "@/lib/utils";

interface DrawerShellProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

/** Extra bottom inset for Base App / home-indicator safe area. */
const drawerBottomInset = "pb-[max(2.5rem,env(safe-area-inset-bottom,0px))]";

export function DrawerShell({
  open,
  onOpenChange,
  header,
  footer,
  children,
}: DrawerShellProps) {
  const hasStickyLayout = header != null || footer != null;

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[60]" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-[70] mx-auto flex max-h-[90dvh] max-w-md flex-col rounded-t-3xl bg-main-lightGray outline-none">
          <div className="flex shrink-0 justify-center pb-1 pt-3">
            <div className="h-1 w-10 rounded-full bg-main-grayPurple" />
          </div>

          {hasStickyLayout ? (
            <div className={cn("flex min-h-0 flex-1 flex-col px-5 pt-4", drawerBottomInset)}>
              {header ? <div className="mb-6 shrink-0">{header}</div> : null}
              <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto overscroll-y-contain">
                {children}
              </div>
              {footer ? <div className="mt-6 shrink-0">{footer}</div> : null}
            </div>
          ) : (
            <div
              className={cn(
                "flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto overscroll-y-contain px-5 pt-4",
                drawerBottomInset
              )}
            >
              {children}
            </div>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
