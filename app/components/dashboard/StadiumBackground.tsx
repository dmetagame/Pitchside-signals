/**
 * Atmospheric texture layered behind dashboard content. At a glance the
 * panel reads as flat dark; on closer look the pitch lines + dot speckle
 * reveal themselves. Non-interactive.
 */
export default function StadiumBackground() {
  return (
    <div
      aria-hidden
      className="stadium-texture pointer-events-none absolute inset-0 z-0 opacity-90"
    />
  );
}
