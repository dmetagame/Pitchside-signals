import type { ReactNode } from "react";

type CardVariant = "default" | "hero" | "raised";

type CardProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
  variant?: CardVariant;
  interactive?: boolean;
};

const VARIANT_CLASSES: Record<CardVariant, string> = {
  default: "bg-panel border-line",
  hero: "bg-panel-muted border-line-strong relative overflow-hidden",
  raised: "bg-panel-raised border-line",
};

export default function Card({
  children,
  className = "",
  as: Tag = "div",
  variant = "default",
  interactive = false,
}: CardProps) {
  const base = "relative rounded-2xl border p-6 shadow-card transition-colors";
  const interactiveCls = interactive
    ? "hover:border-accent/40 hover:shadow-[0_0_24px_rgba(34,226,4,0.18)]"
    : "";

  return (
    <Tag className={`${base} ${VARIANT_CLASSES[variant]} ${interactiveCls} ${className}`}>
      {variant === "hero" && (
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-accent/15 blur-3xl"
        />
      )}
      {children}
    </Tag>
  );
}
