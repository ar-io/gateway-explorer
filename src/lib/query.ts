import { QueryClient, queryOptions } from "@tanstack/react-query";
import { extractGarItems } from "./convert";
import {
  downloadReportInfoForTransaction,
  querySingleTransaction,
} from "./observer/downloadObservation";
import { fetchGarCacheWithIncentiveContractData } from "./incentive/fetchIncentiveContractData";
import { Network } from "./networks";

export const queryClient = new QueryClient();

export const garQueryBuilder = (network: Network) =>
  queryOptions({
    queryKey: ["gar", network],
    queryFn: async () => {
      const garCacheWtihIncentiveContractData =
        await fetchGarCacheWithIncentiveContractData(network);

      const garItems = extractGarItems(garCacheWtihIncentiveContractData);
      garItems.sort((a, b) => a.fqdnKey.localeCompare(b.fqdnKey));
      return garItems;
    },
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      console.error(error);
      return failureCount <= 10;
    }
  });

export const reportTxQueryBuilder = (txId: string) =>
  queryOptions({
    queryKey: ["observationReportTx", txId],
    queryFn: async () => {
      const tx = await querySingleTransaction(txId);
      const reportData = await downloadReportInfoForTransaction(tx);
      return {
        tx,
        reportData,
      };
    },
  });
