import { keccak256, stringToHex, type Hex } from "viem";
import type { Direction } from "./types";

export type AgentScan = {
  agentId: string;
  market: string;
  venue: string;
  direction: Direction;
  confidenceBps: number;
  stakeUsdc: number;
  entryPrice: number;
  targetPrice: number;
  reasoning: string;
  sources: string[];
  sourceHash: Hex;
  generatedAt: string;
  expiresAt: string;
  agentRuntime?: string;
  fallback?: boolean;
  fallbackReason?: string;
  provider?: "groq" | "anthropic" | "seed";
  providerStatus?: {
    groqConfigured: boolean;
    anthropicConfigured: boolean;
    selectedProvider: "groq" | "anthropic" | "seed";
    rateLimit?: {
      remaining: number;
      resetAt: string;
    };
  };
};

type ScanTemplate = Omit<AgentScan, "generatedAt" | "expiresAt" | "sourceHash"> & {
  signalWindowHours: number;
};

const templates: ScanTemplate[] = [
  {
    agentId: "bracket-quant",
    market: "Argentina reaches semi-final",
    venue: "X Cup bracket market",
    direction: "YES",
    confidenceBps: 6400,
    stakeUsdc: 460,
    entryPrice: 0.44,
    targetPrice: 0.58,
    reasoning:
      "The bracket simulator gives Argentina a cleaner route than the crowd line implies: lower travel-rest drag, stronger transition defense, and a favorable quarter-final branch.",
    sources: ["path-simulator", "rest-window", "opponent-pressing"],
    signalWindowHours: 18,
  },
  {
    agentId: "set-piece-scout",
    market: "England vs USA over 9.5 corners",
    venue: "X Cup prop market",
    direction: "YES",
    confidenceBps: 5900,
    stakeUsdc: 520,
    entryPrice: 0.47,
    targetPrice: 0.55,
    reasoning:
      "Both sides project high wide-entry volume, and the match-state tree keeps crossing pressure alive even if one team scores early.",
    sources: ["wide-entry-rate", "corner-model", "referee-profile"],
    signalWindowHours: 12,
  },
  {
    agentId: "crowd-xi",
    market: "Japan tops Group F",
    venue: "X Cup group market",
    direction: "YES",
    confidenceBps: 7200,
    stakeUsdc: 380,
    entryPrice: 0.31,
    targetPrice: 0.46,
    reasoning:
      "Fan flow is moving faster than public odds after Japan's pressing metrics and transition chance quality improved across the latest simulated window.",
    sources: ["social-velocity", "pressing-index", "market-depth"],
    signalWindowHours: 36,
  },
  {
    agentId: "keeper-index",
    market: "France first clean sheet",
    venue: "X Cup defensive market",
    direction: "NO",
    confidenceBps: 6300,
    stakeUsdc: 410,
    entryPrice: 0.52,
    targetPrice: 0.40,
    reasoning:
      "The clean-sheet price is too high against the projected shot-quality mix and back-line rotation risk in France's opening scenario.",
    sources: ["shot-quality", "keeper-form", "lineup-rotation"],
    signalWindowHours: 24,
  },
  {
    agentId: "pitch-oracle",
    market: "Brazil wins simulated opener",
    venue: "X Cup match market",
    direction: "YES",
    confidenceBps: 6100,
    stakeUsdc: 440,
    entryPrice: 0.58,
    targetPrice: 0.71,
    reasoning:
      "Brazil's opener line lags the squad-depth model, which prices better late-game control and fewer rest penalties than the opponent pool.",
    sources: ["team-form-index", "fixture-rest-map", "crowd-odds"],
    signalWindowHours: 24,
  },
  {
    agentId: "alpha-ref",
    market: "Golden Boot won by group-stage leader",
    venue: "X Cup awards market",
    direction: "YES",
    confidenceBps: 5800,
    stakeUsdc: 360,
    entryPrice: 0.39,
    targetPrice: 0.50,
    reasoning:
      "Award paths are more concentrated than the headline market suggests because early goal share compounds with easier knockout fixtures.",
    sources: ["scoring-path", "group-difficulty", "award-history"],
    signalWindowHours: 30,
  },
];

export function generateAgentScan({
  expiresInSeconds,
  now = new Date(),
  salt = "pitchside-signals-agent-scan",
  sequence = 0,
}: {
  expiresInSeconds?: number;
  now?: Date;
  salt?: string;
  sequence?: number;
} = {}): AgentScan {
  const template = templates[positiveModulo(sequence, templates.length)];
  const { signalWindowHours, ...signal } = template;
  const expiresAt = new Date(
    now.getTime() +
      (expiresInSeconds ?? signalWindowHours * 60 * 60) * 1000,
  );
  const sourcePayload = [
    salt,
    sequence,
    signal.agentId,
    signal.market,
    signal.direction,
    signal.confidenceBps,
    signal.stakeUsdc,
    signal.sources.join(","),
    now.toISOString(),
  ].join(":");

  return {
    ...signal,
    generatedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    sourceHash: keccak256(stringToHex(sourcePayload)),
  };
}

export function directionToContractValue(direction: Direction): number {
  switch (direction) {
    case "LONG":
      return 0;
    case "SHORT":
      return 1;
    case "YES":
      return 2;
    case "NO":
      return 3;
  }
}

function positiveModulo(value: number, divisor: number): number {
  return ((value % divisor) + divisor) % divisor;
}
