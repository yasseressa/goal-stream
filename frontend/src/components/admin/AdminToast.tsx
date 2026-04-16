"use client";

type AdminToastProps = {
  message: string | null;
  tone?: "success" | "error";
  onClose: () => void;
};

export function AdminToast({ message, tone = "success", onClose }: AdminToastProps) {
  if (!message) return null;

  const toneClass =
    tone === "success"
      ? "border-emerald-500/30 bg-emerald-500/12 text-emerald-100"
      : "border-rose-500/30 bg-rose-500/12 text-rose-100";

  return (
    <div className="fixed inset-x-4 top-4 z-[80] flex justify-center">
      <div className={`flex w-full max-w-md items-center justify-between gap-3 rounded-[1.2rem] border px-4 py-3 shadow-[0_16px_45px_rgba(0,0,0,0.35)] backdrop-blur ${toneClass}`}>
        <p className="text-sm font-semibold">{message}</p>
        <button type="button" onClick={onClose} className="text-xs font-bold uppercase tracking-[0.14em] opacity-80 transition hover:opacity-100">
          Close
        </button>
      </div>
    </div>
  );
}
