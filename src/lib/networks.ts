export const networks = ["mainnet", "testnet", "devnet"] as const;
export const defaultNetwork: Network = "testnet";

export type Network = (typeof networks)[number];

type ContractTxIdConfig = {
  garCache: string;
};

export const contractTxIdMap: Record<Network, ContractTxIdConfig> = {
  mainnet: {
    garCache: "bLAgYxAdX2Ry-nt6aH2ixgvJXbpsEYm28NgJgyqfs-U",
  },
  testnet: {
    garCache: "bLAgYxAdX2Ry-nt6aH2ixgvJXbpsEYm28NgJgyqfs-U",
  },
  devnet: {
    garCache: "_NctcA2sRy1-J4OmIQZbYFPM17piNcbdBPH2ncX2RL8",
  },
};

type EndpointConfig = {
  garCache: string;
  distributions: string;
  balance: (address: string) => string;
};

const subdomainMap: Record<Network, string> = {
  mainnet: "api",
  testnet: "api",
  devnet: "dev",
};

const endpointBuilder = (
  network: Network,
  contractTxId: string,
  path: string = "/",
  version: string = "v1"
) =>
  `https://${subdomainMap[network]}.arns.app/${version}/contract/${contractTxId}${path}`;

type NetworkConfig = {
  contractTxIds: ContractTxIdConfig;
  endpoints: EndpointConfig;
};

const configBuilder = (network: Network): NetworkConfig => {
  const contractTxIds = contractTxIdMap[network];
  const endpoints = {
    garCache: endpointBuilder(
      network,
      contractTxIds.garCache,
      "/read/gateways"
    ),
    distributions: endpointBuilder(
      network,
      contractTxIds.garCache,
      "/distributions"
    ),
    balance: (address: string) =>
      endpointBuilder(network, contractTxIds.garCache, `/balances/${address}`),
  };
  return { contractTxIds, endpoints };
};

export const networkConfigMap: Record<Network, NetworkConfig> = {
  mainnet: configBuilder("mainnet"),
  testnet: configBuilder("testnet"),
  devnet: configBuilder("devnet"),
};
