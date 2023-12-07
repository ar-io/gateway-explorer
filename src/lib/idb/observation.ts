import Dexie, { Table } from "dexie";
import { GatewayAssessmentSummary } from "../observer/report";

export interface GatewayAssessmentStandalone {
  id: string;
  type: string;
  timestamp: number;
  targetGatewayHost: string;
  gatewayAssessmentSummary: GatewayAssessmentSummary;
}

export class ObservationDatabase extends Dexie {
  public gatewayAssessments!: Table<GatewayAssessmentStandalone, string>;

  public constructor() {
    super("ObservationDatabase");
    this.version(1).stores({
      gatewayAssessments: "id, type, timestamp, targetGatewayHost",
    });
  }
}

export const observationDb = new ObservationDatabase();
