import { ArrowRight, MoreHorizontal } from "lucide-react";
import ChartGlowDefs from "./ChartGlowDefs";

const SIZE = 220;
const HEIGHT = 178;
const STROKE = 18;
const CENTER = SIZE / 2;
const RADIUS = CENTER - STROKE / 2;
const START_ANGLE = (3 * Math.PI) / 4;
const ARC_ANGLE = (3 * Math.PI) / 2;

function arcPath(percent: number): string {
  const clamped = Math.min(Math.max(percent, 0), 100) / 100;
  if (clamped <= 0) return "";
  const endAngle = START_ANGLE + clamped * ARC_ANGLE;
  const x1 = CENTER + RADIUS * Math.cos(START_ANGLE);
  const y1 = CENTER + RADIUS * Math.sin(START_ANGLE);
  const x2 = CENTER + RADIUS * Math.cos(endAngle);
  const y2 = CENTER + RADIUS * Math.sin(endAngle);
  const largeArc = clamped * ARC_ANGLE > Math.PI ? 1 : 0;
  return `M ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${x2} ${y2}`;
}

function pointOnGaugeCurve(percent: number): { x: number; y: number } {
  const clamped = Math.min(Math.max(percent, 0), 100) / 100;
  const angle = START_ANGLE + clamped * ARC_ANGLE;
  return {
    x: CENTER + RADIUS * Math.cos(angle),
    y: CENTER + RADIUS * Math.sin(angle),
  };
}

export default function Gauge({
  title,
  percent,
  target,
  resolvedCount,
}: {
  title: string;
  percent: number;
  target?: number;
  resolvedCount: number;
}) {
  const targetPoint = target !== undefined ? pointOnGaugeCurve(target) : null;
  const status =
    target === undefined
      ? null
      : percent >= target
        ? `Above ${target}% target`
        : `${(target - percent).toFixed(1)} pts below ${target}% target`;

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-line bg-panel p-6 shadow-card">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-text">{title}</h2>
          <p className="mt-1 text-xs text-muted">Aggregate across resolved signals</p>
        </div>
        <button
          type="button"
          aria-label="Card actions"
          className="flex size-8 items-center justify-center rounded-lg text-faint hover:bg-panel-muted hover:text-muted"
        >
          <MoreHorizontal className="size-4" strokeWidth={1.75} />
        </button>
      </header>

      <div className="relative mx-auto" style={{ width: SIZE, height: HEIGHT }}>
        <svg
          viewBox={`0 0 ${SIZE} ${HEIGHT}`}
          width={SIZE}
          height={HEIGHT}
          aria-hidden
        >
          <defs>
            <linearGradient id="gauge-mint" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#22E204" />
              <stop offset="100%" stopColor="#3DDFFF" />
            </linearGradient>
            <ChartGlowDefs id="gauge-glow" />
          </defs>

          {/* Track */}
          <path
            d={arcPath(100)}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.08}
            strokeWidth={STROKE}
            strokeLinecap="round"
          />
          {/* Filled arc */}
          {percent > 0 && (
            <path
              d={arcPath(percent)}
              fill="none"
              stroke="url(#gauge-mint)"
              strokeWidth={STROKE}
              strokeLinecap="round"
              filter="url(#gauge-glow)"
            />
          )}
          {targetPoint && (
            <g>
              <circle
                cx={targetPoint.x}
                cy={targetPoint.y}
                r={4}
                fill="currentColor"
                opacity={0.85}
              />
              <text
                x={targetPoint.x}
                y={targetPoint.y - 12}
                fontSize={10}
                fontWeight={600}
                textAnchor="middle"
                fill="currentColor"
                opacity={0.7}
              >
                {target}%
              </text>
            </g>
          )}
        </svg>

        <div className="absolute inset-x-0 bottom-8 flex flex-col items-center">
          <span className="text-3xl font-semibold tracking-tight text-text tabular-nums">
            {percent.toFixed(0)}%
          </span>
          <span className="text-[11px] uppercase tracking-wider text-faint">
            {resolvedCount} resolved
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className={`text-xs ${status?.startsWith("Above") ? "text-accent" : "text-muted"}`}>
          {status ?? "No target set"}
        </span>
        <a
          href="#"
          className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-strong"
        >
          Show details
          <ArrowRight className="size-3" strokeWidth={2} />
        </a>
      </div>
    </section>
  );
}
