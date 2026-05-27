import { ArrowUpRight, Sparkles } from "lucide-react";
import type { Agent, Signal } from "../../lib/types";
import { xLayerTxUrl } from "../../lib/explorer";
import AgentAvatar from "./AgentAvatar";
import TxChip from "./TxChip";

export default function AgentAssistant({
  signal,
  agent,
}: {
  signal?: Signal;
  agent?: Agent;
}) {
  const hasSignal = signal && agent;

  return (
    <section className="relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-line bg-panel p-6 shadow-card">
      {/* Live-pulse orb: outer halo + inner core, both animated. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-6 -top-6 size-32 rounded-full bg-accent/25 blur-2xl assistant-orb"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute right-4 top-4 inline-flex size-3 rounded-full bg-accent shadow-[0_0_18px_rgba(34,226,4,0.7)] assistant-pulse"
      />

      <header className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-accent-foreground shadow-[0_0_18px_rgba(34,226,4,0.4)]">
            <Sparkles className="size-4" strokeWidth={2} />
          </span>
          <div>
            <h2 className="text-base font-semibold text-text">Agent Assistant</h2>
            <p className="text-xs text-muted">Latest reasoning</p>
          </div>
        </div>
      </header>

      <div className="relative flex flex-col gap-3">
        {hasSignal ? (
          <>
            <div className="flex items-center gap-2">
              <AgentAvatar agent={agent} />
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-text">{agent.name}</div>
                <div className="truncate text-xs text-muted">
                  {signal.market} · {signal.direction}
                </div>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-muted line-clamp-4">
              {signal.reasoning}
            </p>

            <div className="flex items-center justify-between gap-2 pt-1">
              <TxChip hash={signal.txHash} href={xLayerTxUrl(signal.txHash)} label="signal" />
              <a
                href="#"
                className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-strong"
              >
                Open
                <ArrowUpRight className="size-3" strokeWidth={2} />
              </a>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted">
            Quiet on the touchline — run an agent cycle to surface the next signal.
          </p>
        )}
      </div>

      <style>{`
        @keyframes assistantOrbPulse {
          0%, 100% { transform: scale(1); opacity: 0.55; }
          50% { transform: scale(1.12); opacity: 0.85; }
        }
        @keyframes assistantDotPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.35); opacity: 0.7; }
        }
        .assistant-orb { animation: assistantOrbPulse 3.6s ease-in-out infinite; }
        .assistant-pulse { animation: assistantDotPulse 2s ease-in-out infinite; }
      `}</style>
    </section>
  );
}
