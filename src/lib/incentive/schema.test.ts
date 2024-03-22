import { test, expect } from "bun:test";
import { incentiveContractEndpointSchema } from "./schema";

// From /read/gateways
import IncentiveContract from "../../fixtures/IncentiveContract.json";

test("parse IncentiveContract fixture", () => {
  const result = incentiveContractEndpointSchema.safeParse(IncentiveContract);
  expect(result.success).toBeTruthy();
});
