import { test, expect } from "bun:test";
import ReportCurrent from "../../fixtures/ReportCurrent.json";
import { observerReportSchema } from "./schema";

test("parse ReportCurrent fixture", () => {
  const result = observerReportSchema.safeParse(ReportCurrent);
  expect(result.success).toBeTruthy();
});
