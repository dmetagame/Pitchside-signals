import { Gavel, MoreHorizontal } from "lucide-react";
import type { Agent, Direction, Signal } from "../../lib/types";
import AgentAvatar from "./AgentAvatar";

const usd = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

type Status = "Active" | "Won" | "Lost";

function deriveStatus(signal: Signal): Status {
  if (signal.status === "active") return "Active";
  return signal.correct ? "Won" : "Lost";
}

function StatusPill({ status }: { status: Status }) {
  if (status === "Active") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/70 bg-accent/5 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-accent shadow-[0_0_14px_rgba(34,226,4,0.22)]">
        <span className="size-1.5 rounded-full bg-accent" />
        Active
      </span>
    );
  }
  if (status === "Won") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-accent-foreground">
        <span className="size-1.5 rounded-full bg-accent-foreground/70" />
        Won
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-danger px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-text">
      <span className="size-1.5 rounded-full bg-text/80" />
      Lost
    </span>
  );
}

function SidePill({ direction }: { direction: Direction }) {
  const styles: Record<Direction, string> = {
    YES: "border-accent/60 bg-accent/10 text-accent",
    NO: "border-line bg-panel-muted text-muted",
    LONG: "border-[color:var(--color-chart-teal)]/40 bg-[color:var(--color-chart-teal)]/10 text-[color:var(--color-chart-teal)]",
    SHORT: "border-[color:var(--color-chart-magenta)]/40 bg-[color:var(--color-chart-magenta)]/10 text-[color:var(--color-chart-magenta)]",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider ${styles[direction]}`}
    >
      {direction}
    </span>
  );
}

function ConfidenceBar({ bps }: { bps: number }) {
  const pct = Math.max(0, Math.min(100, bps / 100));
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-sm font-semibold text-text tabular-nums">
        {pct.toFixed(0)}%
      </span>
      <div className="h-1 w-14 overflow-hidden rounded-full bg-panel-muted">
        <div
          className="h-full rounded-full bg-accent shadow-[0_0_6px_rgba(34,226,4,0.6)]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function SignalTable({
  signals,
  agents,
  onSelect,
  onResolve,
  resolving = false,
  settlementLocked,
  settlementCountdown,
}: {
  signals: Signal[];
  agents: Agent[];
  onSelect?: (signal: Signal) => void;
  onResolve?: (signal: Signal) => void | Promise<void>;
  resolving?: boolean;
  settlementLocked?: (signal: Signal) => boolean;
  settlementCountdown?: (signal: Signal) => string;
}) {
  const agentMap = new Map(agents.map((a) => [a.id, a]));

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-line bg-panel p-6 shadow-card">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-text">Signal Book</h2>
          <p className="mt-1 text-xs text-muted">
            {signals.length} signal{signals.length === 1 ? "" : "s"} on record · X Layer settlement
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

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-separate border-spacing-0">
          <thead>
            <tr className="text-[10px] uppercase tracking-[0.14em] text-faint">
              <th className="px-3 py-2 text-left font-semibold">ID</th>
              <th className="px-3 py-2 text-left font-semibold">Market</th>
              <th className="px-3 py-2 text-left font-semibold">Agent</th>
              <th className="px-3 py-2 text-left font-semibold">Side</th>
              <th className="px-3 py-2 text-right font-semibold">Confidence</th>
              <th className="px-3 py-2 text-right font-semibold">Stake</th>
              <th className="px-3 py-2 text-right font-semibold">Status</th>
              {onResolve && <th className="px-3 py-2 text-right font-semibold">Settlement</th>}
            </tr>
          </thead>
          <tbody>
            {signals.length === 0 && (
              <tr>
                <td
                  colSpan={onResolve ? 8 : 7}
                  className="rounded-xl border border-dashed border-line-soft bg-panel-muted/40 px-3 py-10 text-center text-sm text-faint"
                >
                  No signals yet — the whistle hasn&apos;t blown.
                </td>
              </tr>
            )}
            {signals.map((signal) => {
              const agent = agentMap.get(signal.agentId);
              const status = deriveStatus(signal);
              const locked = settlementLocked?.(signal) ?? false;
              const countdown = settlementCountdown?.(signal);
              return (
                <tr
                  key={signal.id}
                  onClick={() => onSelect?.(signal)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSelect?.(signal);
                    }
                  }}
                  role={onSelect ? "button" : undefined}
                  tabIndex={onSelect ? 0 : undefined}
                  className={[
                    "text-sm text-text transition-colors hover:bg-accent/[0.04]",
                    onSelect ? "cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/40" : "",
                  ].join(" ")}
                >
                  <td className="border-t border-line-soft px-3 py-3 font-mono text-xs text-muted">
                    {signal.id}
                  </td>
                  <td className="border-t border-line-soft px-3 py-3">
                    <div className="font-medium text-text">{signal.market}</div>
                    <div className="mt-0.5 inline-flex items-center gap-1 rounded-md border border-line-soft bg-panel-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-faint">
                      <span className="size-1 rounded-full bg-accent/70" />
                      X Layer settlement
                    </div>
                  </td>
                  <td className="border-t border-line-soft px-3 py-3">
                    {agent ? (
                      <div className="flex items-center gap-2">
                        <AgentAvatar agent={agent} />
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium text-text">{agent.name}</div>
                          <div className="truncate text-[11px] text-faint">{agent.desk}</div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-faint">Unknown</span>
                    )}
                  </td>
                  <td className="border-t border-line-soft px-3 py-3">
                    <SidePill direction={signal.direction} />
                  </td>
                  <td className="border-t border-line-soft px-3 py-3 text-right">
                    <div className="inline-flex">
                      <ConfidenceBar bps={signal.confidenceBps} />
                    </div>
                  </td>
                  <td className="border-t border-line-soft px-3 py-3 text-right font-mono text-sm font-semibold text-text tabular-nums">
                    {usd(signal.stakeUsdc)}
                  </td>
                  <td className="border-t border-line-soft px-3 py-3 text-right">
                    <StatusPill status={status} />
                  </td>
                  {onResolve && (
                    <td className="border-t border-line-soft px-3 py-3 text-right">
                      {status === "Active" ? (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            onResolve(signal);
                          }}
                          disabled={resolving || locked}
                          title={locked ? "Settlement unlocks after expiry" : undefined}
                          className="inline-flex items-center gap-1 rounded-md border border-accent/40 bg-accent/5 px-2 py-1 font-mono text-[11px] font-semibold text-accent hover:border-accent/70 hover:bg-accent/10 disabled:cursor-not-allowed disabled:border-line disabled:bg-panel-muted disabled:text-muted"
                        >
                          <Gavel className="size-3" strokeWidth={2} />
                          {locked && countdown ? countdown : locked ? "Locked" : "Resolve"}
                        </button>
                      ) : (
                        <span className="font-mono text-[11px] text-faint">—</span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
