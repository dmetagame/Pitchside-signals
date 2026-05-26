import { useId } from "react";

type Props = {
  size?: number;
  className?: string;
  withBackground?: boolean;
  title?: string;
};

const PITCH = "#16a34a";
const LINE = "#e8fff0";
const ACCENT = "#d4ff3e";

export default function PitchSideMark({
  size = 40,
  className,
  withBackground = false,
  title = "PitchSide Signals",
}: Props) {
  const id = useId().replace(/:/g, "");
  const glow = `ps-glow-${id}`;

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id={glow} cx="72%" cy="24%" r="42%">
          <stop offset="0%" stopColor={ACCENT} />
          <stop offset="100%" stopColor={PITCH} />
        </radialGradient>
      </defs>

      {withBackground && <rect x="0" y="0" width="100" height="100" fill="#0b3b2e" />}

      <rect x="16" y="22" width="68" height="56" rx="8" fill={`url(#${glow})`} />
      <path
        d="M50 22v56M16 50h68M27 34h13v32H27M60 34h13v32H60"
        fill="none"
        stroke={LINE}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
      />
      <circle cx="50" cy="50" r="10" fill="none" stroke={LINE} strokeWidth="5" />
      <path
        d="M68 24l11 11M79 24 68 35"
        stroke="#0b0f12"
        strokeLinecap="round"
        strokeWidth="6"
      />
    </svg>
  );
}
