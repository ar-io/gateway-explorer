import { z } from "zod";
import { arnsResolutionSchema } from "../../lib/observer/schema";

export const zArweaveTxId = z.string().regex(/^[\w-]{43}$/);

export const zGatewayVault = z.object({
  balance: z.number().nonnegative(),
  start: z.number().int().nonnegative(),
  end: z.number().int().nonnegative(),
});

export const zGatewayAddressRegistryItemData = z.object({
  operatorStake: z.number().nonnegative(),
  vaults: z.record(zArweaveTxId, zGatewayVault),
  settings: z.object({
    label: z.string(),
    fqdn: z.string().regex(/^[a-z0-9-]+(\.[a-z0-9-]+)*$/i),
    port: z.number().int().nonnegative(),
    protocol: z.enum(["http", "https"]),
    properties: z.string().optional(),
    note: z.string().optional(),
  }),
  status: z.enum(["joined"]),
  start: z.number().int().nonnegative(),
  end: z.number().int().nonnegative(),
  observerWallet: zArweaveTxId,
});

export const zGatewayAddressRegistryCache = z.object({
  contractTxId: z.string(),
  gateways: z.record(zArweaveTxId, zGatewayAddressRegistryItemData),
  evaluationOptions: z.object({}),
});

export const zGatewayHealthCheck = z.object({
  uptime: z.number().nonnegative(),
  message: z.string().optional(),
  date: z.string().datetime().optional(),
});

// TODO: Copy from observation protocol standard
export const zArioObservation = z.object({
  pass: z.boolean(),
  resolution: arnsResolutionSchema.optional(),
});
