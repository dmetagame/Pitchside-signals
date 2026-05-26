import type { Agent } from "./types";

export type AgentCategory = "Match" | "Props" | "Sentiment" | "Bracket" | "Resolution";

export type CompositionSegment = {
  category: AgentCategory;
  count: number;
  stake: number;
  color: string;
};

const CATEGORY_ORDER: AgentCategory[] = ["Match", "Props", "Sentiment", "Bracket", "Resolution"];

const FALLBACK_COLOR: Record<AgentCategory, string> = {
  Match: "#7dd3fc",
  Props: "#f97316",
  Sentiment: "#22c55e",
  Bracket: "#a78bfa",
  Resolution: "#facc15",
};

export function categorizeDesk(desk: string): AgentCategory {
  const lower = desk.toLowerCase();
  if (lower.includes("prop") || lower.includes("game")) return "Props";
  if (lower.includes("fan") || lower.includes("sentiment")) return "Sentiment";
  if (lower.includes("bracket") || lower.includes("tournament")) return "Bracket";
  if (lower.includes("resolution")) return "Resolution";
  return "Match";
}

export function computeComposition(agents: Agent[]): {
  segments: CompositionSegment[];
  totalAgents: number;
  totalStake: number;
} {
  const buckets = new Map<AgentCategory, CompositionSegment>();
  for (const agent of agents) {
    const category = categorizeDesk(agent.desk);
    const existing = buckets.get(category);
    if (existing) {
      existing.count += 1;
      existing.stake += agent.stakedUsdc;
    } else {
      buckets.set(category, {
        category,
        count: 1,
        stake: agent.stakedUsdc,
        color: agent.color || FALLBACK_COLOR[category],
      });
    }
  }

  const segments = CATEGORY_ORDER.flatMap((cat) => {
    const seg = buckets.get(cat);
    return seg ? [seg] : [];
  });

  return {
    segments,
    totalAgents: agents.length,
    totalStake: agents.reduce((sum, a) => sum + a.stakedUsdc, 0),
  };
}
