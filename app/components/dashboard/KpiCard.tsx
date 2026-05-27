import type { LucideIcon } from "lucide-react";
import DeltaPill from "./DeltaPill";

export type KpiCardProps = {
  label: string;
  value: string;
  icon: LucideIcon;
  delta?: { value: number; direction?: "up" | "down" | "flat" };
  context?: string;
};

export default function KpiCard({ label, value, icon: Icon, delta, context }: KpiCardProps) {
  return (
    <div className="group relative rounded-2xl border border-line bg-panel p-5 shadow-card transition-all hover:border-accent/40 hover:shadow-[0_0_24px_rgba(34,226,4,0.18)]">
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
          {label}
        </span>
        <span className="flex size-8 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent/15">
          <Icon className="size-[18px]" strokeWidth={1.75} />
        </span>
      </div>

      <div className="mt-4 flex items-end gap-2">
        <span className="text-[34px] font-semibold leading-none tracking-tight text-text tabular-nums">
          {value}
        </span>
        {delta && <DeltaPill value={delta.value} direction={delta.direction} />}
      </div>

      {context && (
        <p className="mt-2 text-xs text-muted">
          {context}
        </p>
      )}
    </div>
  );
}
