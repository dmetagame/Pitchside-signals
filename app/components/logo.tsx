import { useId } from "react";

type PitchSideLogoProps = {
  size?: number;
  className?: string;
  variant?: "mint" | "dark";
  title?: string;
};

export default function PitchSideLogo({
  size = 32,
  className,
  variant = "mint",
  title = "PitchSide Signals",
}: PitchSideLogoProps) {
  const titleId = useId();
  const isMint = variant === "mint";
  const bg = isMint ? "var(--pitch-glow)" : "var(--panel-bg-alt)";
  const fg = isMint ? "var(--panel-bg)" : "var(--pitch-glow)";
  const line = isMint ? "rgba(6, 23, 13, 0.34)" : "rgba(34, 226, 4, 0.24)";

  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-labelledby={titleId}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>
      <rect width="32" height="32" rx="7" fill={bg} />
      <path
        d="M7 22.5V8.5h9.5c3 0 5 1.75 5 4.5 0 2.85-2.05 4.6-5.1 4.6h-4.2"
        fill="none"
        stroke={fg}
        strokeLinecap="square"
        strokeLinejoin="round"
        strokeWidth="3.2"
      />
      <path
        d="M18 22.5h6.5c1.9 0 3-1.05 3-2.65 0-1.45-.85-2.25-2.45-2.65l-3.4-.85c-2.1-.5-3.3-1.7-3.3-3.7 0-2.6 2-4.15 5.25-4.15h4.2"
        fill="none"
        stroke={fg}
        strokeLinecap="square"
        strokeLinejoin="round"
        strokeWidth="3.2"
      />
      <path d="M7 25.5h18" stroke={line} strokeLinecap="round" strokeWidth="2" />
      <circle cx="25.5" cy="25.5" r="1.6" fill={fg} opacity="0.88" />
    </svg>
  );
}
