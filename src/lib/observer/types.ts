/**
 * AR.IO Observer
 * Copyright (C) 2023 Permanent Data Solutions, Inc. All Rights Reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
// import { WriteInteractionResponse } from 'warp-contracts/mjs';

//
// Arweave
//

export interface BlockSource {
  getBlockByHeight(height: number): Promise<unknown>; // TODO fix unknown
}

export interface HeightSource {
  getHeight(): Promise<number>;
}

//
// Name selection
//

export interface EntropySource {
  getEntropy(opts?: { [key: string]: unknown }): Promise<Buffer>;
}

export interface ArnsNameList {
  getNamesCount(height: number): Promise<number>;
  getName(height: number, index: number): Promise<string>;
  getAllNames(height: number): Promise<string[]>;
}

export interface ArnsNamesSource {
  getNames(opts?: { [key: string]: unknown }): Promise<string[]>;
}

//
// Gateways
//

export interface GatewayHost {
  start?: number;
  end?: number;
  fqdn: string;
  port?: number;
  protocol?: string;
  wallet: string;
}

export interface GatewayHostList {
  getHosts(): Promise<GatewayHost[]>;
}

//
// Observers
//

export interface ObserversSource {
  getObservers(opts?: { [key: string]: unknown }): Promise<string[]>;
}

//
// Observer report
//

export interface OwnershipAssessment {
  expectedWallet?: string;
  observedWallet: string | null;
  failureReason?: string;
  pass: boolean;
}

export interface ArnsNameAssessment {
  assessedAt: number;
  expectedStatusCode?: number;
  resolvedStatusCode?: number;
  expectedId: string | null;
  resolvedId: string | null;
  expectedDataHash: string | null;
  resolvedDataHash: string | null;
  pass: boolean;
  failureReason?: string;
  timings?: {
    wait?: number;
    dns?: number;
    tcp?: number;
    tls?: number;
    firstByte?: number;
    download?: number;
    total?: number;
  };
}

export interface ArnsNameAssessments {
  [arnsName: string]: ArnsNameAssessment;
}

export interface GatewayArnsAssessments {
  prescribedNames: ArnsNameAssessments;
  chosenNames: ArnsNameAssessments;
  pass: boolean;
}

export interface GatewayAssessment {
  ownershipAssessment: OwnershipAssessment;
  arnsAssessments: GatewayArnsAssessments;
  pass: boolean;
}

export interface GatewayAssessments {
  [gatewayHost: string]: GatewayAssessment;
}

export interface ObserverReport {
  observerAddress: string;
  epochStartHeight: number;
  generatedAt: number;
  gatewayAssessments: GatewayAssessments;
}

//
// Report store
//

export interface ReportSaveResult {
  reportTxId?: string;
  interactionTxIds?: string[];
}

export interface ReportSink {
  saveReport(
    report: ObserverReport,
    reportSaveResult?: ReportSaveResult
  ): Promise<ReportSaveResult | undefined>;
}

export interface ReportStore {
  saveReport(report: ObserverReport): Promise<ReportSaveResult | undefined>;
  getReport(epochStartHeight: number): Promise<ObserverReport | null>;
  latestReport(): Promise<ObserverReport | null>;
}

// //
// // Contract
// //

// export interface ObservationInteraction {
//   function: string;
//   observerReportTxId: string;
//   failedGateways: string[];
// }

// export interface ObserverContract {
//   writeInteraction(
//     interaction: ObservationInteraction,
//   ): Promise<WriteInteractionResponse | null>;
// }

// from @szmarczak/http-timer
export interface Timings {
  start: number;
  socket?: number;
  lookup?: number;
  connect?: number;
  secureConnect?: number;
  upload?: number;
  response?: number;
  end?: number;
  error?: number;
  abort?: number;
  phases: {
    wait?: number;
    dns?: number;
    tcp?: number;
    tls?: number;
    request?: number;
    firstByte?: number;
    download?: number;
    total?: number;
  };
}

export interface ArnsResolution {
  statusCode: number;
  resolvedId: string | null;
  ttlSeconds: string | null;
  contentLength: string | null;
  contentType: string | null;
  dataHashDigest: string | null;
  timings: Timings | null;
}
