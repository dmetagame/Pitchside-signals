import Groq from "groq-sdk";
import { keccak256, stringToHex } from "viem";
import type { AgentScan } from "./agent-scan";
import {
  normalizeProposeSignalArgs,
  proposeSignalParameters,
  type ProposeSignalArgs,
} from "./agent-scan-schema";
import { agents as seedAgents, marketTape } from "./seed";

const MODEL = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `You are PitchSide Signals' X Cup forecasting desk. You propose accountable World Cup-themed prediction signals published by one of the listed football agents onto X Layer. Every call is staked in demo credits and resolved against an objective match, bracket, or award outcome. Reputation depends on calibration, so propose ideas you would defend.

You MUST call the proposeSignal tool exactly once. Pick the agent whose desk most naturally fits the highest-conviction idea right now. The reasoning string is the most important field — it should read like a one-paragraph desk memo, name the mechanism, and avoid generic platitudes.

Stay within each agent's existing markets where possible. Confidence is in basis points (0–10000). Stake is in demo credits between 200 and 800. Entry and target prices should be event probabilities between 0 and 1 when applicable.`;

const AGENT_ROSTER_BLOCK = `Agent roster:\n${seedAgents
  .map(
    (a) =>
      `- id="${a.id}" handle="${a.handle}" desk="${a.desk}" risk=${a.risk} markets=[${a.markets.join(", ")}]\n  thesis: ${a.thesis}`,
  )
  .join("\n")}`;

export function groqConfigured(): boolean {
  return Boolean(process.env.GROQ_API_KEY);
}

export async function generateAgentScanWithGroq({
  sequence = 0,
  expiresInSeconds,
  now = new Date(),
}: {
  sequence?: number;
  expiresInSeconds?: number;
  now?: Date;
} = {}): Promise<AgentScan> {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not set.");
  }

  const client = new Groq();
  const tape = marketTape
    .map((t) => `${t.symbol} ${t.price} (${t.change})`)
    .join(", ");

  const completion = await client.chat.completions.create({
    model: MODEL,
    temperature: 0.7,
    max_tokens: 700,
    messages: [
      { role: "system", content: `${SYSTEM_PROMPT}\n\n${AGENT_ROSTER_BLOCK}` },
      {
        role: "user",
        content: `Current market tape: ${tape}.\nGenerate a fresh accountable signal (sequence ${sequence}). Avoid repeating the same market two sequences in a row. Keep the reasoning specific and defensible.`,
      },
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "proposeSignal",
          description:
            "Publish a single accountable X Cup market signal as one of the PitchSide agents.",
          parameters: proposeSignalParameters,
        },
      },
    ],
    tool_choice: { type: "function", function: { name: "proposeSignal" } },
  });

  const toolCall = completion.choices[0]?.message?.tool_calls?.[0];
  if (!toolCall || toolCall.function?.name !== "proposeSignal") {
    throw new Error("LLM did not call proposeSignal.");
  }

  let rawArgs: unknown;
  try {
    rawArgs = JSON.parse(toolCall.function.arguments);
  } catch (error) {
    throw new Error(
      `Could not parse proposeSignal arguments: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  const args: ProposeSignalArgs = normalizeProposeSignalArgs(rawArgs);

  const generatedAt = now.toISOString();
  const expiresAt = new Date(
    now.getTime() +
      (expiresInSeconds ?? Math.max(1, args.windowHours) * 60 * 60) * 1000,
  ).toISOString();

  const sourcePayload = [
    "pitchside-signals-groq-scan",
    sequence,
    args.agentId,
    args.market,
    args.direction,
    args.confidenceBps,
    args.stakeUsdc,
    args.sources.join(","),
    generatedAt,
  ].join(":");

  return {
    agentId: args.agentId,
    market: args.market,
    venue: args.venue,
    direction: args.direction,
    confidenceBps: args.confidenceBps,
    stakeUsdc: args.stakeUsdc,
    entryPrice: args.entryPrice,
    targetPrice: args.targetPrice,
    reasoning: args.reasoning.trim(),
    sources: args.sources,
    sourceHash: keccak256(stringToHex(sourcePayload)),
    generatedAt,
    expiresAt,
  };
}

export function groqRuntimeLabel(): string {
  return MODEL;
}
