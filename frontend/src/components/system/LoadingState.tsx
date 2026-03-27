export function LoadingState({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center rounded-[1.5rem] border border-dashed border-pitch-100 bg-white/70 p-10 text-sm font-semibold text-pitch-700 ${className}`}>
      Loading...
    </div>
  );
}
