import type {
  ScamAnalysisInput,
  ScamAnalysisResult,
} from "@kiwi-scamcheck/contracts";

export function analyseMessage(
  input: ScamAnalysisInput,
): ScamAnalysisResult {
    void input; // This is to avoid unused variable warning, since we are not using the input in this stub implementation.
  return {
    riskScore: 0,
    riskLevel: "low",
    signals: [],
    recommendedActions: [],
    engineVersion: "0.1.0",
  };
}