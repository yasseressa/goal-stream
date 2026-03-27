import { Button } from "@/components/ui/Button";

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-[1.5rem] border border-red-200 bg-red-50 p-6 text-red-800 shadow-card">
      <p className="text-base font-semibold">{message}</p>
      {onRetry ? <Button className="mt-4" onClick={onRetry}>Retry</Button> : null}
    </div>
  );
}
