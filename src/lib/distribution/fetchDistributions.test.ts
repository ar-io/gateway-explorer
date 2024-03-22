import { describe, it, expect } from "bun:test";
import { fetchDistributions } from "./fetchDistributions";

describe("fetchDistributions", () => {
  it("should fetch distributions from endpoint", async () => {
    const distributions = await fetchDistributions("mainnet");

    expect(distributions).toBeDefined();
  });
});
