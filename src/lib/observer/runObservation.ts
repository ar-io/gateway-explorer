import { z } from "zod";
import ky from "ky";
import pMap from "p-map";
import { arrayBufferToBase64Url } from "../utils";
import { arnsResolutionSchema } from "./schema";
import {
  ArnsNameAssessment,
  ArnsNameAssessments,
  ArnsResolution,
  GatewayAssessment,
  OwnershipAssessment,
} from "./types";
import { zGatewayAddressRegistryItem } from "@/types";

const nameAssessmentConcurrency = 10;
// const gatewayAsessementConcurrency = 10;
const NAME_PASS_THRESHOLD = 0.8;
const referenceGatewayHost = "ar-io.dev";

interface ArioInfo {
  wallet?: string;
}

async function assessOwnership({
  host,
  expectedWallet,
}: {
  host: string;
  expectedWallet: string;
}): Promise<OwnershipAssessment> {
  try {
    const url = `https://${host}/ar-io/info`;
    const resp = await ky
      .get(url, {
        timeout: 10_000, // 10 seconds
      })
      .json<ArioInfo>();
    if (resp?.wallet) {
      if (resp.wallet !== expectedWallet) {
        return {
          expectedWallet,
          observedWallet: null,
          failureReason: `Wallet mismatch: expected ${expectedWallet} but found ${resp.wallet}`,
          pass: false,
        };
      } else {
        return {
          expectedWallet,
          observedWallet: resp.wallet,
          pass: true,
        };
      }
    }
    return {
      expectedWallet,
      observedWallet: null,
      failureReason: `No wallet found`,
      pass: false,
    };
  } catch (error) {
    return {
      expectedWallet,
      observedWallet: null,
      failureReason: (error as Error | undefined)?.message as string,
      pass: false,
    };
  }
}

export const getArnsResolution = async ({
  host,
  port,
  arnsName,
}: {
  host: string;
  port?: number;
  arnsName: string;
}): Promise<z.infer<typeof arnsResolutionSchema>> => {
  const url = `https://${arnsName}.${host}:${port ?? 443}/`;

  const startTimestamp = Date.now();
  const response = await ky.get(url, {
    timeout: 10_000, // 10 seconds
    throwHttpErrors: false,
  });
  const responseTimestamp = Date.now();

  if (!response.ok) {
    if (response.status === 404) {
      return {
        statusCode: 404,
        resolvedId: null,
        ttlSeconds: null,
        contentType: null,
        contentLength: null,
        dataHashDigest: null,
        timings: null,
      };
    } else {
      throw new Error(
        `Unexpected response status: ${response.status} (${response.statusText}))`
      );
    }
  }

  const data = await response.arrayBuffer();
  const endTimestamp = Date.now();

  const dataHash = await crypto.subtle.digest("SHA-256", data);
  const dataHashBase64url = arrayBufferToBase64Url(dataHash);

  return arnsResolutionSchema.parse({
    statusCode: response.status,
    resolvedId: response.headers.get("x-arns-resolved-id"),
    ttlSeconds: response.headers.get("x-arns-ttl-seconds"),
    contentType: response.headers.get("content-type"),
    contentLength: response.headers.get("content-length"),
    dataHashDigest: dataHashBase64url,
    timings: {
      start: startTimestamp,
      phases: {
        request: responseTimestamp - startTimestamp,
        total: endTimestamp - startTimestamp,
      },
    },
  });
};

const assessArnsName = async ({
  referenceGatewayHost,
  host,
  arnsName,
}: {
  referenceGatewayHost: string;
  host: string;
  arnsName: string;
}): Promise<ArnsNameAssessment> => {
  // TODO handle exceptions
  const referenceResolution = await getArnsResolution({
    host: referenceGatewayHost,
    arnsName,
  });

  const gatewayResolution = await getArnsResolution({
    host,
    arnsName,
  });

  let pass = true;
  let failureReason: string | undefined = undefined;

  const checkedProperties: Array<keyof ArnsResolution> = [
    "resolvedId",
    "ttlSeconds",
    "contentType",
    "dataHashDigest",
  ];
  for (const property of checkedProperties) {
    if (referenceResolution[property] !== gatewayResolution[property]) {
      pass = false;
      failureReason =
        (failureReason !== undefined ? failureReason + ", " : "") +
        `${property} mismatch`;
    }
  }

  return {
    assessedAt: +(Date.now() / 1000).toFixed(0),
    expectedStatusCode: referenceResolution.statusCode,
    resolvedStatusCode: gatewayResolution.statusCode,
    expectedId: referenceResolution.resolvedId ?? null,
    resolvedId: gatewayResolution.resolvedId ?? null,
    expectedDataHash: referenceResolution.dataHashDigest ?? null,
    resolvedDataHash: gatewayResolution.dataHashDigest ?? null,
    failureReason,
    pass,
    timings: gatewayResolution?.timings?.phases,
  };
};

const assessArnsNames = async ({
  referenceGatewayHost,
  host,
  names,
}: {
  referenceGatewayHost: string;
  host: string;
  names: string[];
}): Promise<ArnsNameAssessments> => {
  return pMap(
    names,
    async (name) => {
      try {
        return await assessArnsName({
          referenceGatewayHost,
          host,
          arnsName: name,
        });
      } catch (err) {
        const errorMessage =
          typeof err === "object" &&
          err !== null &&
          "message" in err &&
          typeof err.message === "string"
            ? err.message
            : undefined;
        return {
          assessedAt: +(Date.now() / 1000).toFixed(0),
          expectedId: null,
          resolvedId: null,
          expectedDataHash: null,
          resolvedDataHash: null,
          failureReason: errorMessage?.slice(0, 512),
          pass: false,
        };
      }
    },
    { concurrency: nameAssessmentConcurrency }
  ).then((results) => {
    return results.reduce((assessments, assessment, index) => {
      assessments[names[index]] = assessment;
      return assessments;
    }, {} as ArnsNameAssessments);
  });
};

export const generateGatewayAssessmentForHost = async (
  host: z.infer<typeof zGatewayAddressRegistryItem>,
  specifiedPrescribedNames: string[],
  specifiedChosenNames: string[]
): Promise<GatewayAssessment> => {
  const prescribedNames = specifiedPrescribedNames;
  const chosenNames = specifiedChosenNames;

  // Assess gateway

  const ownershipAssessment = await assessOwnership({
    host: host.settings.fqdn,
    expectedWallet: host.id,
  });

  const [prescribedAssessments, chosenAssessments] = await Promise.all([
    await assessArnsNames({
      referenceGatewayHost,
      host: host.settings.fqdn,
      names: prescribedNames,
    }),
    await assessArnsNames({
      referenceGatewayHost,
      host: host.settings.fqdn,
      names: chosenNames,
    }),
  ]);

  const nameCount = new Set([...prescribedNames, ...chosenNames]).size;
  const namePassCount = Object.values({
    ...prescribedAssessments,
    ...chosenAssessments,
  }).reduce((count, assessment) => (assessment.pass ? count + 1 : count), 0);
  const namesPass = namePassCount >= nameCount * NAME_PASS_THRESHOLD;

  const gatewayAssessment = {
    ownershipAssessment,
    arnsAssessments: {
      prescribedNames: prescribedAssessments,
      chosenNames: chosenAssessments,
      pass: namesPass,
    },
    pass: ownershipAssessment.pass && namesPass,
  };

  return gatewayAssessment;
};
