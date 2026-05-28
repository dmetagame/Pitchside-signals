import { MoreHorizontal } from "lucide-react";
import type { AgentCategory, CompositionSegment } from "../../lib/composition";
import { formatUsdc } from "../../lib/reputation";

const PALETTE: Record<AgentCategory, string> = {
  Match: "#22E204",
  Props: "#3DDFFF",
  Sentiment: "#FF3D88",
  Bracket: "#FF6EBE",
  Resolution: "#FFD93D",
};

function colorFor(segment: CompositionSegment): string {
  return PALETTE[segment.category] ?? segment.color;
}

export default function SegmentedBreakdown({
  title,
  segments,
  totalAgents,
  totalStake,
}: {
  title: string;
  segments: CompositionSegment[];
  totalAgents: number;
  totalStake: number;
}) {
  const totalForSegments = segments.reduce((sum, s) => sum + s.stake, 0) || 1;

  return (
    <section className="flex flex-col gap-5 rounded-2xl border border-line bg-panel p-6 shadow-card">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-text">{title}</h2>
          <p className="mt-1 text-xs text-muted">
            {totalAgents} agent{totalAgents === 1 ? "" : "s"} · {formatUsdc(totalStake)} staked
          </p>
        </div>
        <button
          type="button"
          aria-label="Card actions"
          className="flex size-8 items-center justify-center rounded-lg text-faint hover:bg-panel-muted hover:text-muted"
        >
          <MoreHorizontal className="size-4" strokeWidth={1.75} />
        </button>
      </header>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {segments.map((segment) => {
          const color = colorFor(segment);
          const pct = (segment.stake / totalForSegments) * 100;
          return (
            <div key={segment.category} className="flex flex-col gap-2">
              <span className="text-[11px] font-medium uppercase tracking-wider text-faint">
                {segment.category}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold tracking-tight text-text tabular-nums">
                  {segment.count}
                </span>
                <span className="text-xs text-muted tabular-nums">{pct.toFixed(0)}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-panel-muted">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: color,
                    boxShadow: `0 0 8px ${color}55`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex h-2.5 w-full overflow-hidden rounded-full border border-line-soft">
        {segments.map((segment) => {
          const color = colorFor(segment);
          const pct = (segment.stake / totalForSegments) * 100;
          return (
            <span
              key={`bar-${segment.category}`}
              style={{ width: `${pct}%`, backgroundColor: color }}
              className="h-full"
              title={`${segment.category} · ${formatUsdc(segment.stake)}`}
            />
          );
        })}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted">
        {segments.map((segment) => {
          const color = colorFor(segment);
          const pct = (segment.stake / totalForSegments) * 100;
          return (
            <span
              key={`legend-${segment.category}`}
              className="inline-flex items-center gap-1.5"
            >
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
              />
              <span className="text-text">{segment.category}</span>
              <span className="tabular-nums text-faint">{pct.toFixed(0)}%</span>
            </span>
          );
        })}
      </div>
    </section>
  );
}
