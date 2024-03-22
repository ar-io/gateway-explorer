import { Network, networkConfigMap } from "../networks";
import { zDistributionEndpointSchema } from "./schema";

export const fetchDistributions = async (network: Network) => {
  const endpoint = networkConfigMap[network].endpoints.distributions;
  return fetch(endpoint)
    .then((res) => res.json())
    .then((json) => zDistributionEndpointSchema.parse(json).distributions);
};
