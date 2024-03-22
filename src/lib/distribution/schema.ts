import { z } from "zod";
import { zArweaveTxId } from "../gar/schema";

export const zDistributionSchema = z.object({
  epochStartHeight: z.number().int().nonnegative(),
  epochEndHeight: z.number().int().nonnegative(),
  epochPeriod: z.number().int().nonnegative(),
  epochZeroStartHeight: z.number().int().nonnegative(),
  nextDistributionHeight: z.number().int().nonnegative(),
});

export const zDistributionEndpointSchema = z.object({
  contractTxId: zArweaveTxId,
  distributions: zDistributionSchema,
  evaluationOptions: z.object({}),
});
