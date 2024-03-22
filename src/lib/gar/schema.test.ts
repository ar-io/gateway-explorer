import { expect, test } from "bun:test";
import { zGatewayAddressRegistryCache } from "./schema";

// From /gateways, not /read/gateways
import GatewayAddressRegistryCache from "../../fixtures/GatewayAddressRegistryCache.json";

test("parse GatewayAddressRegistryCache fixture", () => {
  const result = zGatewayAddressRegistryCache.safeParse(
    GatewayAddressRegistryCache
  );
  expect(result.success).toBeTruthy();
});
