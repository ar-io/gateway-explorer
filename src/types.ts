import { z } from "zod";
import { incentiveContractItemSchema } from "./lib/incentive/schema";
import { zArioObservation, zArweaveTxId } from "./lib/gar/schema";

export const zGatewayAddressRegistryItem = z.intersection(
  z.object({
    id: zArweaveTxId,
    fqdnKey: z.string(),
    linkFull: z.string().url(),
    linkDisplay: z.string(),
    ping: z.discriminatedUnion("status", [
      z.object({ status: z.literal("unknown") }),
      z.object({ status: z.literal("pending") }),
      z.object({ status: z.literal("error"), error: z.string().optional() }),
      z.object({
        status: z.literal("success"),
        value: z.number().int().nonnegative(),
      }),
    ]),
    health: z.discriminatedUnion("status", [
      z.object({ status: z.literal("unknown") }),
      z.object({ status: z.literal("pending") }),
      z.object({ status: z.literal("error"), error: z.string().optional() }),
      z.object({
        status: z.literal("success"),
        uptime: z.number().nonnegative(),
      }),
    ]),
    observation: z.discriminatedUnion("status", [
      z.object({ status: z.literal("unknown") }),
      z.object({ status: z.literal("pending") }),
      z.object({ status: z.literal("error"), error: z.string().optional() }),
      z.object({
        status: z.literal("success"),
        result: zArioObservation,
      }),
    ]),
    gatewayRating: z.number().nonnegative(),
    delegateRewardProportion: z.number(),
    delegateEffectiveRewardProportion: z.number(),
    delegateCount: z.number().int().nonnegative(),
  }),
  incentiveContractItemSchema
);

export const zGatewayObserverInfo = z.object({
  wallet: zArweaveTxId,
  contractId: zArweaveTxId,
});
