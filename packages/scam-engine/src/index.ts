import type {
  ScamAnalysisInput,
  ScamAnalysisResult,
} from "@kiwi-scamcheck/contracts";

import { detectUrgency } from "./urgency-detector";

export { detectUrgency } from "./urgency-detector";

export function analyseMessage(
  input: ScamAnalysisInput,
): ScamAnalysisResult {
  const signals = [detectUrgency(input)].filter(
    (signal) => signal !== undefined,
  );

  return {
    riskScore: signals.reduce(
      (score, signal) => score + signal.scoreContribution,
      0,
    ),
    riskLevel: "low",
    signals,
    recommendedActions: [],
    engineVersion: "0.1.0",
  };
}
