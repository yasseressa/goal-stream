import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "rounded-[1.5rem] border border-white/60 bg-[rgba(255,255,255,0.82)] p-5 shadow-card backdrop-blur-sm",
        className,
      )}
    />
  );
}
