import type { ReactNode } from "react";

type PillVariant = "active" | "filled" | "muted" | "danger" | "teal" | "magenta";
type PillSize = "sm" | "md";

type Props = {
  children: ReactNode;
  variant?: PillVariant;
  size?: PillSize;
  className?: string;
};

const VARIANT: Record<PillVariant, string> = {
  active:
    "border border-accent/70 text-accent bg-accent/5 shadow-[0_0_18px_rgba(34,226,4,0.22)]",
  filled: "bg-accent text-accent-foreground border border-transparent",
  muted: "bg-panel-muted text-muted border border-line",
  danger: "bg-danger-soft text-danger border border-danger/40",
  teal: "bg-[color:var(--color-chart-teal)]/10 text-[color:var(--color-chart-teal)] border border-[color:var(--color-chart-teal)]/40",
  magenta:
    "bg-[color:var(--color-chart-magenta)]/10 text-[color:var(--color-chart-magenta)] border border-[color:var(--color-chart-magenta)]/40",
};

const SIZE: Record<PillSize, string> = {
  sm: "text-[10px] px-2 py-0.5 gap-1",
  md: "text-[11px] px-2.5 py-1 gap-1.5",
};

export default function Pill({
  children,
  variant = "muted",
  size = "md",
  className = "",
}: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold uppercase tracking-wider ${VARIANT[variant]} ${SIZE[size]} ${className}`}
    >
      {children}
    </span>
  );
}
