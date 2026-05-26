import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normalizeError } from "../app/lib/dashboard-actions";

describe("dashboard action errors", () => {
  it("redacts X Layer RPC endpoints and tokens from wallet-facing errors", () => {
    const message = normalizeError(
      new Error(
        "HTTP request failed. URL: https://testrpc.xlayer.tech/terigon Details: Failed to fetch",
      ),
    );

    assert.ok(!message.includes("testrpc.xlayer.tech/terigon"));
    assert.match(message, /\[X Layer RPC endpoint\]/);
  });
});
