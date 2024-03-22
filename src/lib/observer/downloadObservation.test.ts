import { describe, it, expect } from "bun:test";
import {
  downloadReportInfoForTransaction,
  downloadCurrentReportInfoFromGateway,
  downloadObserverInfo,
} from "./downloadObservation";
import transaction from "../../fixtures/ReportTransaction.json";
import transactionData from "../../fixtures/ReportTransactionData.json";

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
    const linkFull = "https://ar-io.dev/";
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
