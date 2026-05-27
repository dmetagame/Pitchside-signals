/**
 * Geometric sport-themed hero illustration. Inline SVG so it inherits page
 * colors and stays crisp. Football + trophy + confetti — abstract, not
 * licensed/realistic.
 */
export default function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 200"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Football, trophy, and confetti"
      className={className}
    >
      <defs>
        <radialGradient id="hero-mint" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--pitch-glow)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--pitch-glow)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hero-trophy" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--chart-gold)" />
          <stop offset="100%" stopColor="#C49A1A" />
        </linearGradient>
        <filter id="hero-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background mint halo behind the trophy */}
      <circle cx="200" cy="100" r="90" fill="url(#hero-mint)" />

      {/* Confetti dots & stars */}
      <g opacity="0.85" fill="var(--pitch-glow)">
        <circle cx="40" cy="40" r="2.5" />
        <circle cx="60" cy="160" r="2" />
        <circle cx="280" cy="50" r="2" />
        <circle cx="300" cy="150" r="2.5" />
      </g>
      <g opacity="0.7" fill="var(--chart-teal)">
        <circle cx="100" cy="30" r="2" />
        <circle cx="250" cy="170" r="2" />
      </g>
      <g opacity="0.7" fill="var(--chart-magenta)">
        <circle cx="170" cy="20" r="1.8" />
        <circle cx="30" cy="120" r="2.2" />
      </g>

      {/* Little 4-point sparkles */}
      <g stroke="var(--pitch-glow)" strokeWidth="1.2" strokeLinecap="round" opacity="0.85">
        <path d="M90 60 L90 70 M85 65 L95 65" />
        <path d="M260 130 L260 138 M256 134 L264 134" />
        <path d="M140 175 L140 183 M136 179 L144 179" />
      </g>

      {/* Trophy */}
      <g transform="translate(170 50)" filter="url(#hero-glow)">
        <path
          d="M20 0 H60 V18 C60 32 50 44 40 44 C30 44 20 32 20 18 Z"
          fill="url(#hero-trophy)"
          stroke="var(--chart-gold)"
          strokeWidth="1.5"
        />
        {/* Trophy handles */}
        <path
          d="M20 6 C12 6 8 12 12 22"
          fill="none"
          stroke="var(--chart-gold)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M60 6 C68 6 72 12 68 22"
          fill="none"
          stroke="var(--chart-gold)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Stem + base */}
        <rect x="36" y="44" width="8" height="14" fill="var(--chart-gold)" />
        <rect x="22" y="58" width="36" height="6" rx="2" fill="var(--chart-gold)" />
        {/* Star on the trophy */}
        <path
          d="M40 16 L43 22 L49 22 L44 26 L46 32 L40 28 L34 32 L36 26 L31 22 L37 22 Z"
          fill="var(--panel-bg)"
        />
      </g>

      {/* Football — hexagonal panels, simplified */}
      <g transform="translate(60 110)" filter="url(#hero-glow)">
        <circle cx="35" cy="35" r="32" fill="var(--panel-bg-raised)" stroke="var(--pitch-glow)" strokeWidth="2" />
        {/* Center pentagon */}
        <path
          d="M35 18 L48 27 L43 42 L27 42 L22 27 Z"
          fill="var(--pitch-glow)"
          stroke="var(--text-primary)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        {/* Outer panel lines */}
        <path
          d="M35 18 L35 6 M48 27 L62 22 M43 42 L52 55 M27 42 L18 55 M22 27 L8 22"
          stroke="var(--pitch-glow)"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.7"
        />
      </g>
    </svg>
  );
}
