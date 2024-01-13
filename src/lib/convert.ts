import {
  zGatewayAddressRegistryCache,
  zGatewayAddressRegistryItem,
} from "@/types";
import { z } from "zod";
import { linkFull, linkDisplay } from "./utils";

const extractGarItems = (
  garCache: z.infer<typeof zGatewayAddressRegistryCache>
): Array<z.infer<typeof zGatewayAddressRegistryItem>> => {
  const gatewayEntries = Object.entries(garCache.gateways);
  return gatewayEntries.map(([txId, item]) => {
    const fqdnIndex = gatewayEntries
      .filter(([, matchItem]) => matchItem.settings.fqdn == item.settings.fqdn)
      .findIndex(([matchTx]) => matchTx === txId);
    const fqdnKey =
      fqdnIndex === 0
        ? item.settings.fqdn
        : `${item.settings.fqdn}${`~${fqdnIndex}`}`;
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
      ...item,
    };
  });
};

export { extractGarItems };
