import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { GET } from "../app/api/agent-scan/route";

describe("agent scan route runtime controls", () => {
  const originalGroqApiKey = process.env.GROQ_API_KEY;
  const originalAnthropicApiKey = process.env.ANTHROPIC_API_KEY;

  afterEach(() => {
    restoreEnv("GROQ_API_KEY", originalGroqApiKey);
    restoreEnv("ANTHROPIC_API_KEY", originalAnthropicApiKey);
  });

  it("serves deterministic forecasts as the default when no LLM provider is configured", async () => {
    delete process.env.GROQ_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;

    const response = await GET(
      new Request("https://pitchside.test/api/agent-scan?sequence=0", {
        headers: { "x-forwarded-for": "agent-scan-runtime-test" },
      }),
    );
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.agentRuntime, "deterministic-scan-v1");
    assert.equal(body.provider, "seed");
    assert.equal(body.fallback, undefined);
    assert.equal(body.fallbackReason, undefined);
    assert.equal(body.signal.agentRuntime, "deterministic-scan-v1");
    assert.equal(response.headers.get("X-RateLimit-Limit"), "30");
  });

  it("rate limits repeated proposal requests per client key", async () => {
    delete process.env.GROQ_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;

    let response: Response | undefined;
    for (let index = 0; index < 31; index += 1) {
      response = await GET(
        new Request(`https://pitchside.test/api/agent-scan?sequence=${index}`, {
          headers: { "x-forwarded-for": "agent-scan-rate-limit-test" },
        }),
      );
    }

    assert.equal(response?.status, 429);
    assert.equal(response?.headers.get("X-RateLimit-Remaining"), "0");
  });
});

function restoreEnv(name: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[name];
  } else {
    process.env[name] = value;
  }
}
