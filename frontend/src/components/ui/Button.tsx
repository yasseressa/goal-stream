import { cn } from "@/lib/utils";

export function Button({
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "bg-pitch-600 text-white hover:bg-pitch-700",
        variant === "secondary" && "bg-accent-500 text-pitch-900 hover:bg-accent-400",
        variant === "ghost" && "border border-pitch-100 bg-white/80 text-pitch-900 hover:bg-pitch-50",
        className,
      )}
      {...props}
    />
  );
}
