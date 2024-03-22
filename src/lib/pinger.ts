import { zGatewayAddressRegistryItem } from "@/types";
import { z } from "zod";
import { zGatewayHealthCheck } from "./gar/schema";

const pingStaggerDelayMs = 10; // 0.01s
const pingTimeout = 5000; // 5s

const pingUpdater = async (
  data: Array<z.infer<typeof zGatewayAddressRegistryItem>>,
  onUpdate?: (
    newData: Array<z.infer<typeof zGatewayAddressRegistryItem>>
  ) => void
) => {
  const newData = structuredClone(data);
  const pingPromises = data.map((item, index) => async () => {
    const url = `${item.linkFull}/ar-io/healthcheck`;

    const delayMs = pingStaggerDelayMs * index;
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    try {
      newData[index].ping = { status: "pending" };
      onUpdate?.(newData);

      const controller = new AbortController();
      const timeoutTrigger = setTimeout(() => controller.abort(), pingTimeout);

      const start = Date.now();
      const fetchResult = await fetch(url, {
        method: "GET",
        signal: controller.signal,
        cache: "no-cache",
      });
      const end = Date.now();
      const duration = end - start;

      clearTimeout(timeoutTrigger);
      newData[index].ping = { status: "success", value: duration };
      onUpdate?.(newData);

      try {
        newData[index].health = { status: "pending" };
        onUpdate?.(newData);

        const healthJson = await fetchResult.json();
        const healthData = zGatewayHealthCheck.parse(healthJson);

        newData[index].health = {
          status: "success",
          uptime: healthData.uptime,
        };
        onUpdate?.(newData);
      } catch (e) {
        // console.debug(`Error checking health: ${url}`, e);
        newData[index].health = {
          status: "error",
          error: e?.toString() ?? JSON.stringify(e),
        };
        onUpdate?.(newData);
      }
    } catch (e) {
      // console.debug(`Error fetching: ${url}`, e);
      newData[index].ping = {
        status: "error",
        error: e?.toString() ?? JSON.stringify(e),
      };
      newData[index].health = {
        status: "error",
      };
      onUpdate?.(newData);
    }
  });
  await Promise.all(pingPromises.map((p) => p()));
  return newData;
};

export { pingUpdater };
