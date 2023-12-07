import { observationDb } from "../idb/observation";
import { generateObserverReportTransactions } from "./downloadObservation";

const cursorKey = (observerAddresses?: string[]) => {
  if (observerAddresses === undefined) {
    return "lastCursor";
  }
  return `lastCursor-[${[...observerAddresses].sort().join(",")}]`;
};

export const loadObservationsLatest = async (
  n: number,
  observerAddresses?: string[]
) => {
  for await (const transactionEdge of generateObserverReportTransactions(
    {
      first: n,
      owners: observerAddresses,
    },
    false
  )) {
    const transaction = transactionEdge.node;
    await observationDb.observationIndex.put(transaction, transaction.id);
    localStorage.setItem(cursorKey(observerAddresses), transactionEdge.cursor);
  }
};

export const loadObservationHistory = async (
  startCursor?: string,
  observerAddresses?: string[]
) => {
  for await (const transactionEdge of generateObserverReportTransactions(
    {
      after: startCursor,
      owners: observerAddresses,
    },
    true
  )) {
    const transaction = transactionEdge.node;
    await observationDb.observationIndex.put(transaction, transaction.id);
    localStorage.setItem(cursorKey(observerAddresses), transactionEdge.cursor);
  }
};
