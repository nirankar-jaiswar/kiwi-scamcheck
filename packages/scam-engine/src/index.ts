import type {
  ScamAnalysisInput,
  ScamAnalysisResult,
} from "@kiwi-scamcheck/contracts";

import { detectBrandLinkMismatch } from "./brand-link-mismatch-detector";
import { detectCredentialRequest } from "./credential-request-detector";
import { detectFamilyImpersonation } from "./family-impersonation-detector";
import { generateRecommendations } from "./recommendations";
import { scoreSignals } from "./scoring";
import { detectSuspiciousUrl } from "./suspicious-url-detector";
import { detectUrgency } from "./urgency-detector";

export { detectBrandLinkMismatch } from "./brand-link-mismatch-detector";
export { detectCredentialRequest } from "./credential-request-detector";
export { detectFamilyImpersonation } from "./family-impersonation-detector";
export { generateRecommendations } from "./recommendations";
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
    detectBrandLinkMismatch(input),
    detectFamilyImpersonation(input),
  ].filter((signal) => signal !== undefined);

  const score = scoreSignals(signals);
  const recommendedActions = generateRecommendations(signals);

  return {
    ...score,
    signals,
    recommendedActions,
    engineVersion: "0.2.0",
  };
}