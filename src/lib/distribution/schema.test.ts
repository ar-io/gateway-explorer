import { describe, it, expect } from "bun:test";
import { zDistributionEndpointSchema } from "./schema";

// From /distributions
import Distributions from "../../fixtures/Distributions.json";

describe("schema", () => {
  it("should parse Distributions", () => {
    const parsed = zDistributionEndpointSchema.parse(Distributions);
    expect(parsed).toBeDefined();
  });
});
