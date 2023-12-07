import { expect, test } from "bun:test";
import { getArnsResolution } from "./runObservation";

test(
  "getArnsResolution from ar.io.dev node for existent ARNS name",
  async () => {
    const gatewayAddress = "ar-io.dev";
    const result = await getArnsResolution({
      host: gatewayAddress,
      arnsName: "bitcoin",
    });

    // expect(result.contentLength).toEqual();
    expect(result.contentType).toEqual("text/html; charset=utf-8");
    expect(result.dataHashDigest).toEqual(
      "6FAUalNO45Lz9ZwFqXt1R3AD7meqmQG_9_VumijD5sI"
    );
    expect(result.resolvedId).toEqual(
      "ynve-5sftS5fUp_UZw39bKuDjIybsm7AsWsBILey9iU"
    );
    expect(result.statusCode).toEqual(200);

    expect(result.timings?.phases.request).toBeGreaterThanOrEqual(0);
    expect(result.timings?.phases.total).toBeGreaterThanOrEqual(0);
    expect(result.timings?.phases.total).toBeGreaterThanOrEqual(
      result.timings!.phases.request!
    );

    expect(parseInt(result.ttlSeconds!)).toBeGreaterThanOrEqual(0);
  },
  { timeout: 11_000 }
);

test(
  "getArnsResolution from ar.io.dev node for nonexistent ARNS name",
  async () => {
    const gatewayAddress = "ar-io.dev";
    const result = await getArnsResolution({
      host: gatewayAddress,
      arnsName: "iyQaJzUFg0iwW8jjr1UNPVvHMI5Hr6qB",
    });

    expect(result).toEqual({
      statusCode: 404,
      resolvedId: null,
      ttlSeconds: null,
      contentType: null,
      contentLength: null,
      dataHashDigest: null,
      timings: null,
    });
  },
  { timeout: 11_000 }
);
