import { z } from "zod";
import { zArweaveTxId } from "../gar/schema";

export const zBalanceEndpointSchema = z.object({
  contractTxId: zArweaveTxId,
  address: zArweaveTxId,
  balance: z.number().nonnegative(),
  sortKey: z.string(),
  evaluationOptions: z.object({}),
});
