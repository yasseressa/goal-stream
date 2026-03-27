import { cn } from "@/lib/utils";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-2xl border border-pitch-100 bg-white px-4 py-3 text-sm text-pitch-900 outline-none transition focus:border-pitch-600 focus:ring-2 focus:ring-pitch-100",
        props.className,
      )}
    />
  );
}
