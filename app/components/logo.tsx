import { useId } from "react";

type PitchSideLogoProps = {
  size?: number;
  className?: string;
  title?: string;
};

/**
 * Corner-flag mark. A solid filled silhouette of a pitch corner flag —
 * the literal side of the pitch from which the brand takes its name.
 * Single-color, no background tile, monolithic geometric form.
 *
 * Color is inherited via currentColor so callers control the tone with
 * Tailwind text-* classes.
 */
export default function PitchSideLogo({
  size = 24,
  className,
  title = "PitchSide Signals",
}: PitchSideLogoProps) {
  const titleId = useId();
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-labelledby={titleId}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>
      <path d="M5 2h2.6v5.6L19.4 9 7.6 14.7V22H5z" />
    </svg>
  );
}
