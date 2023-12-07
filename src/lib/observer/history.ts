import { Transaction } from "arweave-graphql";

export interface ReportHistoryTableData {
  txId: string;
  observerId: string;
  size: number;
  timestamp?: number;
  encoding?: string;
}

export const generateReportHistoryTableData = (
  gqlTransaction: Transaction
): ReportHistoryTableData => {
  const encoding = gqlTransaction.tags
    .find((tag) => tag.name === "Content-Encoding")
    ?.value.toLowerCase();

  return {
    txId: gqlTransaction.id,
    observerId: gqlTransaction.owner.address,
    size: parseInt(gqlTransaction.data.size),
    timestamp: gqlTransaction.block?.timestamp,
    encoding,
  };
};
