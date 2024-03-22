import { Network, networkConfigMap } from "../networks";
import { zBalanceEndpointSchema } from "./schema";

export const fetchBalance = async (network: Network, address: string) => {
  const endpoint = networkConfigMap[network].endpoints.balance(address);
  return fetch(endpoint)
    .then((res) => res.json())
    .then((json) => zBalanceEndpointSchema.parse(json).balance);
};

export const fetchBalanceContract = async (network: Network) => {
  const contractTxId = networkConfigMap[network].contractTxIds.garCache;
  return fetchBalance(network, contractTxId);
};
