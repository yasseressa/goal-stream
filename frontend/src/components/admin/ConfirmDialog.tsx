"use client";

import { Button } from "@/components/ui/Button";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  busy?: boolean;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  busy = false,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[1.6rem] border border-[#4b3818] bg-[linear-gradient(180deg,#17130e_0%,#0f0f0f_100%)] p-5 text-[#f5efe3] shadow-[0_25px_80px_rgba(0,0,0,0.46)]">
        <h3 className="text-xl font-black text-white">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-[#ccb992]">{description}</p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </Button>
          <Button type="button" onClick={onConfirm} disabled={busy} className="bg-[#d8583d] text-white hover:bg-[#eb6a4f]">
            {busy ? "..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
