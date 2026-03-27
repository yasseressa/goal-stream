export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-pitch-100 bg-white/60 p-6 text-sm text-pitch-700">
      {message}
    </div>
  );
}
