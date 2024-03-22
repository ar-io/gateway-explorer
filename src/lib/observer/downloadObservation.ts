import arweaveGraphql, {
  GetTransactionsQuery,
  SortOrder,
} from "arweave-graphql";
import { observerReportSchema } from "./schema";
import { inflate } from "pako";
import { zGatewayObserverInfo } from "@/types";

const gatewayUrl = "arweave.net";
const graphqlUrl = "arweave.net/graphql";
const gql = arweaveGraphql(graphqlUrl);

type TransactionEdge = GetTransactionsQuery["transactions"]["edges"][0];

export type Transaction = TransactionEdge["node"];

export type GetObserverReportTxIdsArgs = Parameters<
  typeof gql.getTransactions
>["0"];

export async function queryObserverReportTransactions(
  args: GetObserverReportTxIdsArgs
) {
  const pageArgs: GetObserverReportTxIdsArgs = {
    tags: [
      { name: "App-Name", values: ["AR-IO Observer"] },
      // { name: "App-Name", values: ["SmartweaveAction"], op: TagOperator.Neq },
      // { name: "App-Version", values: ["0.0.1", "0.0.2"] },
      { name: "Content-Type", values: ["application/json"] },
      // { name: "Content-Encoding", values: ["gzip"] },
    ],
    first: 100,
    sort: SortOrder.HeightAsc,
    ...args,
  };
  const queryRes = await gql.getTransactions(pageArgs);
  return queryRes;
}

export async function querySingleTransaction(id: string) {
  const results = await gql.getTransactions({
    ids: [id],
  });
  if (results.transactions.edges.length === 0) {
    throw new Error(`Transaction not found: ${id}`);
  }
  return results.transactions.edges[0].node;
}

export const downloadReportInfoForTransaction = async (
  transaction: Transaction
) => {
  const txDataRes = await fetch(`https://${gatewayUrl}/${transaction.id}`);
  if (
    transaction.tags.find(
      (t) =>
        t.name.toLowerCase() === "content-encoding" &&
        t.value.toLowerCase() === "gzip"
    ) !== undefined
  ) {
    const txDataInflated = inflate(await txDataRes.arrayBuffer());
    const txDataText = new TextDecoder().decode(txDataInflated);
    const txDataJson = JSON.parse(txDataText);
    return observerReportSchema.parse(txDataJson);
  } else {
    return observerReportSchema.parse(await txDataRes.json());
  }
};

export const downloadCurrentReportInfoFromGateway = async (
  linkFull: string
) => {
  const currentReportUrl = `${linkFull}/ar-io/observer/reports/current`;
  return await fetch(currentReportUrl)
    .then((res) => res.json())
    .then((json) => observerReportSchema.parse(json));
};

export const downloadObserverInfo = async (linkFull: string) => {
  const currentReportUrl = `${linkFull}/ar-io/observer/info`;
  return await fetch(currentReportUrl)
    .then((res) => res.json())
    .then((json) => zGatewayObserverInfo.parse(json));
};
