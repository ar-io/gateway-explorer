import { zGatewayAddressRegistryItem } from "@/types";
import { z } from "zod";
import { linkFull, linkDisplay } from "./utils";
import { incentiveContractSchema } from "./incentive/schema";

const extractGarItems = (
  garCacheWtihIncentiveContractData: z.infer<typeof incentiveContractSchema>
): Array<z.infer<typeof zGatewayAddressRegistryItem>> => {
  const gatewayEntries = Object.entries(garCacheWtihIncentiveContractData);
  return gatewayEntries.map(([txId, item]) => {
    const fqdnIndex = gatewayEntries
      .filter(([, matchItem]) => matchItem.settings.fqdn == item.settings.fqdn)
      .findIndex(([matchTx]) => matchTx === txId);
    const fqdnKey =
      fqdnIndex === 0
        ? item.settings.fqdn
        : `${item.settings.fqdn}${`~${fqdnIndex}`}`;
    const gatewayRating = item.weights.gatewayRewardRatioWeight;
    const delegateRewardProportion = item.settings.delegateRewardShareRatio / 100
    const delegateEffectiveRewardProportion = item.settings.allowDelegatedStaking 
      ? delegateRewardProportion
      : 0;
    const delegateCount = Object.keys(item.delegates).length;

    return {
      id: txId,
      fqdnKey: fqdnKey,
      ping: { status: "unknown" },
      health: { status: "unknown" },
      observation: { status: "unknown" },
      linkFull: linkFull(
        item.settings.protocol,
        item.settings.fqdn,
        item.settings.port
      ),
      linkDisplay: linkDisplay(
        item.settings.protocol,
        item.settings.fqdn,
        item.settings.port
      ),
      gatewayRating,
      delegateRewardProportion,
      delegateEffectiveRewardProportion,
      delegateCount,
      ...item,
    };
  });
};

export { extractGarItems };
