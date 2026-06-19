"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Button } from "@/components/ui/button";
import { RequestResultForm, type RequestResultStatus } from "@/components/ui/RequestResultForm";

interface RequestResultDialogProps {
  /** Controls visibility. Typically `status === "error"`. */
  open: boolean;
  /** Called when the dialog is dismissed (button, backdrop, or escape). */
  onClose: () => void;
  title: string;
  description: string;
  /** Outcome type — selects success or failed icon. Defaults to "failed". */
  status?: RequestResultStatus;
  closeLabel?: string;
}

/**
 * Centered modal popup that floats above everything (including open drawers).
 * Renders through its own portal, so the underlying drawer stays mounted and
 * visible behind the backdrop.
 */
export function RequestResultDialog({
  open,
  onClose,
  title,
  description,
  status = "failed",
  closeLabel = "Close",
}: RequestResultDialogProps) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-[1px]" />
        <Dialog.Viewport className="fixed inset-0 z-[90] flex items-center justify-center p-5">
          <Dialog.Popup className="flex w-full max-w-sm flex-col gap-6 rounded-3xl bg-main-lightGray p-6 outline-none">
            <RequestResultForm status={status} title={title} description={description} />
            <Button variant="primary" size="action" onClick={onClose}>
              {closeLabel}
            </Button>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
