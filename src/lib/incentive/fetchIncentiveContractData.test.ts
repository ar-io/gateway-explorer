import { describe, it, expect } from "bun:test";
import { fetchGarCacheWithIncentiveContractData } from "./fetchIncentiveContractData";

describe("fetchIncentiveContractData", () => {
  it("should fetch fetchIncentiveContractData from endpoint", async () => {
    const observerInfo = await fetchGarCacheWithIncentiveContractData(
      "mainnet"
    );

    // console.log(observerInfo);

    expect(observerInfo).toBeDefined();
  });
});
