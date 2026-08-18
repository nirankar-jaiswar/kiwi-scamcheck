import type {
  ScamAnalysisInput,
  ScamAnalysisResult,
} from "@kiwi-scamcheck/contracts";

import { detectCredentialRequest } from "./credential-request-detector";
import { scoreSignals } from "./scoring";
import { detectSuspiciousUrl } from "./suspicious-url-detector";
import { detectUrgency } from "./urgency-detector";

export { detectCredentialRequest } from "./credential-request-detector";
export { scoreSignals } from "./scoring";
export { detectSuspiciousUrl } from "./suspicious-url-detector";
export { detectUrgency } from "./urgency-detector";

export function analyseMessage(
  input: ScamAnalysisInput,
): ScamAnalysisResult {
  const signals = [
    detectUrgency(input),
    detectCredentialRequest(input),
    detectSuspiciousUrl(input),
  ].filter((signal) => signal !== undefined);
  const score = scoreSignals(signals);

  return {
    ...score,
    signals,
    recommendedActions: [],
    engineVersion: "0.1.0",
  };
}
