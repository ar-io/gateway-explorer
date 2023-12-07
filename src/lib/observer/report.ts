import { ArnsNameAssessments, GatewayAssessment } from "./types";

export type PassFailStats = {
  pass: number;
  fail: number;
  total: number;
  passRate: number;
};

export type GatewayAssessmentSummary = {
  gatewayHost: string;
  gatewayAssessment: GatewayAssessment;
  statistics: {
    passFail: {
      chosenNames: PassFailStats;
      prescribedNames: PassFailStats;
      allNames: PassFailStats;
    };
  };
};

const passFail = (asssessments: ArnsNameAssessments): PassFailStats => {
  const passValues = Object.values(asssessments).map((a) => a.pass);
  const pass = passValues.filter((v) => v).length;
  const fail = passValues.filter((v) => !v).length;
  const total = passValues.length;
  const passRate = pass / total;
  return {
    pass,
    fail,
    total,
    passRate,
  };
};

export const generateGatewayAssessmentSummary = (
  gatewayHost: string,
  gatewayAssessment: GatewayAssessment
): GatewayAssessmentSummary => {
  const { arnsAssessments } = gatewayAssessment;
  const chosenNamesPassFail = passFail(arnsAssessments.chosenNames);
  const prescribedNamesPassFail = passFail(arnsAssessments.prescribedNames);
  const allNamesPassFail = passFail({
    ...arnsAssessments.chosenNames,
    ...arnsAssessments.prescribedNames,
  });
  const statistics = {
    passFail: {
      chosenNames: chosenNamesPassFail,
      prescribedNames: prescribedNamesPassFail,
      allNames: allNamesPassFail,
    },
  };
  return {
    gatewayHost,
    gatewayAssessment,
    statistics,
  };
};
