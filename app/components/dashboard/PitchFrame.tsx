import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

/**
 * Outer "pitch" frame. The body itself provides the green gradient bleed;
 * this component insets the dashboard inside a rounded panel so the bleed
 * reads as a border of stadium-field light around the dark stage.
 */
export default function PitchFrame({ children }: Props) {
  return (
    <div className="relative min-h-screen p-3 sm:p-4 md:p-6">
      <div className="relative isolate overflow-hidden rounded-3xl border border-line-strong bg-panel shadow-card">
        {children}
      </div>
    </div>
  );
}
