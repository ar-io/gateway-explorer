import { expect, test } from "bun:test";
import IncentiveContract from "../fixtures/IncentiveContract.json";
import { zGatewayAddressRegistryItem } from "../types";
import { extractGarItems } from "./convert";
import { z } from "zod";
import { incentiveContractEndpointSchema } from "./incentive/schema";

test("convert GatewayAddressRegistryCache fixture", () => {
  const garCache = incentiveContractEndpointSchema.parse(IncentiveContract);
  const garItems = extractGarItems(garCache.result);
  expect(garItems.length).toEqual(Object.keys(garCache.result).length);

  const garItemsParsed = z
    .array(zGatewayAddressRegistryItem)
    .safeParse(garItems);
  expect(garItemsParsed.success).toBeTruthy();
});
