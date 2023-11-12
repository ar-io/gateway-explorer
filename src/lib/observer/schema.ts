import { z } from "zod";

export const gatewayHostSchema = z.object({
  start: z.number().optional(),
  end: z.number().optional(),
  fqdn: z.string(),
  port: z.number().optional(),
  protocol: z.string().optional(),
  wallet: z.string(),
});

export const ownershipAssessmentSchema = z.object({
  expectedWallet: z.string(),
  observedWallet: z.string().nullable(),
  failureReason: z.string().optional(),
  pass: z.boolean(),
});

export const arnsNameAssessmentSchema = z.object({
  assessedAt: z.number(),
  expectedStatusCode: z.number().optional(),
  resolvedStatusCode: z.number().optional(),
  expectedId: z.string().nullable(),
  resolvedId: z.string().nullable(),
  expectedDataHash: z.string().nullable(),
  resolvedDataHash: z.string().nullable(),
  pass: z.boolean(),
  failureReason: z.string().optional(),
  timings: z
    .object({
      wait: z.number().optional(),
      dns: z.number().optional(),
      tcp: z.number().optional(),
      tls: z.number().optional(),
      firstByte: z.number().optional(),
      download: z.number().optional(),
      total: z.number().optional(),
    })
    .optional(),
});

export const arnsNameAssessmentsSchema = z.record(arnsNameAssessmentSchema);

export const gatewayArnsAssessmentsSchema = z.object({
  prescribedNames: arnsNameAssessmentsSchema,
  chosenNames: arnsNameAssessmentsSchema,
  pass: z.boolean(),
});

export const gatewayAssessmentsSchema = z.record(
  z.object({
    ownershipAssessment: ownershipAssessmentSchema,
    arnsAssessments: gatewayArnsAssessmentsSchema,
    pass: z.boolean(),
  })
);

export const observerReportSchema = z.object({
  observerAddress: z.string(),
  epochStartHeight: z.number(),
  generatedAt: z.number(),
  gatewayAssessments: gatewayAssessmentsSchema,
});

export const reportSaveResultSchema = z.object({
  reportTxId: z.string().optional(),
  interactionTxIds: z.array(z.string()).optional(),
});