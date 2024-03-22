import { Transaction } from "arweave-graphql";

export interface ReportHistoryTableData {
  txId: string;
  observerId: string;
  size: number;
  timestamp?: number;
  encoding?: string;
  version?: string;
  isSupportedVersion?: boolean;
}

const versionWhitelist = ["0.0.1"];

export const generateReportHistoryTableData = (
  gqlTransaction: Transaction
): ReportHistoryTableData => {
  const encoding = gqlTransaction.tags
    .find((tag) => tag.name === "Content-Encoding")
    ?.value.toLowerCase();
  const version = gqlTransaction.tags
    .find((tag) => tag.name === "App-Version")
    ?.value.toLowerCase();
  const isSupportedVersion = versionWhitelist.includes(version ?? "");

  return {
    txId: gqlTransaction.id,
    observerId: gqlTransaction.owner.address,
    size: parseInt(gqlTransaction.data.size),
    timestamp: gqlTransaction.block?.timestamp,
    encoding,
    version,
    isSupportedVersion,
  };
};
