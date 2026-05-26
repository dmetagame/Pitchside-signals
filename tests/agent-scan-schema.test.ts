import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normalizeProposeSignalArgs } from "../app/lib/agent-scan-schema";

describe("agent proposal schema normalization", () => {
  it("coerces stringified numeric fields from LLM tool calls", () => {
    const normalized = normalizeProposeSignalArgs({
      agentId: "pitch-oracle",
      market: "Brazil wins simulated opener",
      venue: "X Cup match market",
      direction: "YES",
      confidenceBps: "6200",
      stakeUsdc: "600",
      entryPrice: "0.58",
      targetPrice: "0.71",
      reasoning:
        "Brazil projects better late-game control and squad depth than the crowd price implies in the simulated opener.",
      sources: ["team-form-index", "fixture-rest-map"],
      windowHours: "48",
    });

    assert.equal(normalized.confidenceBps, 6200);
    assert.equal(normalized.stakeUsdc, 600);
    assert.equal(normalized.entryPrice, 0.58);
    assert.equal(normalized.targetPrice, 0.71);
    assert.equal(normalized.windowHours, 48);
  });

  it("rejects unknown agents", () => {
    assert.throws(
      () =>
        normalizeProposeSignalArgs({
          agentId: "unknown-agent",
          market: "Japan tops Group F",
          venue: "X Cup group market",
          direction: "YES",
          confidenceBps: 6000,
          stakeUsdc: 400,
          entryPrice: 100,
          targetPrice: 105,
          reasoning:
            "Japan's pressing metrics and transition quality are rising faster than the public group market implies.",
          sources: ["pressing-index", "market-depth"],
          windowHours: 24,
        }),
      /Unknown agentId/,
    );
  });
});
