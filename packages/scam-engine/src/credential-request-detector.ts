import type {
  RiskSignal,
  ScamAnalysisInput,
} from "@kiwi-scamcheck/contracts";

const AUTHENTICATION_REQUEST_PATTERN =
  /\b(?:provide|send|enter|share|confirm|verify|submit)\s+(?:(?:us|me)\s+)?(?:(?:your|the|a|an)\s+)?(?:username\s+and\s+password|login\s+(?:details|credentials)|one[-\s]time\s+password|verification\s+code|security\s+code|authentication\s+code|password|pin|otp)\b/gi;

const SENSITIVE_DETAILS_REQUEST_PATTERN =
  /\b(?:provide|send|enter|share|confirm|verify|submit|update)\s+(?:(?:us|me)\s+)?(?:your\s+)?(?:personal\s+details|bank\s+details|banking\s+details|card\s+details|account\s+details|payment\s+details|details)\b/gi;

const NEGATED_REQUEST_PATTERN =
  /\b(?:never|do not|don't|should not|shouldn't)\s+$/i;

export function detectCredentialRequest(
  input: ScamAnalysisInput,
): RiskSignal | undefined {
  const patterns = [
    AUTHENTICATION_REQUEST_PATTERN,
    SENSITIVE_DETAILS_REQUEST_PATTERN,
  ];

  const evidence = patterns
    .flatMap((pattern) => Array.from(input.text.matchAll(pattern)))
    .filter((match) => {
      const precedingText = input.text.slice(0, match.index);

      return !NEGATED_REQUEST_PATTERN.test(precedingText);
    })
    .map(([match]) => match)
    .filter(
      (match, index, matches) =>
        matches.findIndex(
          (candidate) =>
            candidate.toLowerCase() === match.toLowerCase(),
        ) === index,
    );

  if (evidence.length === 0) {
    return undefined;
  }

  return {
    code: "CREDENTIAL_REQUEST",
    title: "Sensitive information requested",
    explanation:
      "The message asks for authentication, personal, account, or payment information that may be sensitive.",
    severity: "high",
    evidence,
    scoreContribution: 30,
  };
}