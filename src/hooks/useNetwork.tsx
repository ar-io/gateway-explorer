import { Network, defaultNetwork } from '@/lib/networks';
import { useLocalStorage } from '@rehooks/local-storage';

// @ts-expect-error For future use
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const urlDerivedNetwork = () => {
  const url = new URL(window.location.href);
  const hostname = url.hostname;
  const domainParts = hostname.split('.');
  const tld = domainParts.slice(-1)[0];
  if (tld === 'dev') {
    return 'devnet';
  }
  return null;
}

const defaultNetworkContextual: Network = import.meta.env.VITE_DEFAULT_NETWORK ?? defaultNetwork;

export const useNetwork = () => {
  const [network, setNetwork] = useLocalStorage<Network>('network', defaultNetworkContextual);

  return { network, setNetwork };
};
