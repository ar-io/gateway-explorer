import { describe, it, expect } from "bun:test";
import {
  GetObserverReportTxIdsArgs,
  generateObserverReportTransactions,
  downloadReportInfoForTransaction,
  downloadCurrentReportInfoFromGateway,
  downloadObserverInfo,
} from "./downloadObservation";
import { SortOrder } from "arweave-graphql";
import transaction from "../../fixtures/ReportTransaction.json";
import transactionData from "../../fixtures/ReportTransactionData.json";

describe("getObserverReportsTxIdsArweave", () => {
  it("should fetch transactions from Arweave GraphQL endpoint", async () => {
    const args: GetObserverReportTxIdsArgs = {
      first: 10,
      sort: SortOrder.HeightDesc,
    };

    const transactions = await Array.fromAsync(
      generateObserverReportTransactions(args, false)
    );

    // console.log(transactions);

    expect(transactions).toBeDefined();
    expect(transactions.length).toBeGreaterThan(0);
  });
});

describe("getReportInfo", () => {
  it("should fetch report info from Arweave gateway", async () => {
    const reportInfo = await downloadReportInfoForTransaction(transaction);

    // console.log(reportInfo);

    expect(reportInfo).toBeDefined();
    expect(reportInfo).toEqual(transactionData);
  });
});

describe("downloadCurrentReportInfoFromGateway", () => {
  it("should fetch report info from an gateway node", async () => {
    const linkFull = "https://permagate.io";
    const reportInfo = await downloadCurrentReportInfoFromGateway(linkFull);

    // console.log(reportInfo);

    expect(reportInfo).toBeDefined();
  });
});

describe("downloadObserverInfo", () => {
  it("should fetch observer info from an gateway node", async () => {
    const linkFull = "https://vilenarios.com";
    const observerInfo = await downloadObserverInfo(linkFull);

    // console.log(observerInfo);

    expect(observerInfo).toBeDefined();
  });
});
