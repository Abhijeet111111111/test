import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  accent?: "red" | "neutral";
  hint?: string;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  accent = "neutral",
  hint,
}: StatCardProps) {
  return (
    <div className="rounded-xl border bg-card p-5 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight truncate">
          {value}
        </p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </div>
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
          accent === "red"
            ? "bg-[var(--brand-red)]/10 text-[var(--brand-red)]"
            : "bg-muted text-muted-foreground",
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );
}
