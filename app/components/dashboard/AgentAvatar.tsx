import {
  BadgeCheck,
  Bot,
  CircleDot,
  Goal,
  ShieldCheck,
  Trophy,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import type { Agent } from "../../lib/types";

const AGENT_ICON: Record<string, LucideIcon> = {
  "pitch-oracle": Goal,
  "set-piece-scout": CircleDot,
  "crowd-xi": UsersRound,
  "bracket-quant": Trophy,
  "keeper-index": ShieldCheck,
  "alpha-ref": BadgeCheck,
};

const SIZE = {
  sm: "size-7",
  md: "size-9",
} as const;

const ICON_SIZE = {
  sm: "size-3.5",
  md: "size-4",
} as const;

export default function AgentAvatar({
  agent,
  size = "sm",
}: {
  agent?: Agent;
  size?: keyof typeof SIZE;
}) {
  const Icon = agent ? (AGENT_ICON[agent.id] ?? Bot) : Bot;

  return (
    <span
      className={[
        "flex shrink-0 items-center justify-center rounded-full border border-accent/35 bg-panel-raised text-accent",
        "shadow-[0_0_10px_rgba(34,226,4,0.18)]",
        SIZE[size],
      ].join(" ")}
      title={agent?.name ?? "Unknown agent"}
    >
      <Icon className={ICON_SIZE[size]} strokeWidth={2} />
    </span>
  );
}
