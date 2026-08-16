import type {
  RiskSignal,
  ScamAnalysisInput,
} from "@kiwi-scamcheck/contracts";

const URGENCY_PATTERN =
  /\b(?:act immediately|within 24 hours|final warning|act now|urgent|immediately)\b/gi;

export function detectUrgency(input: ScamAnalysisInput): RiskSignal | undefined {
  const evidence = Array.from(input.text.matchAll(URGENCY_PATTERN))
    .map(([match]) => match)
    .filter(
      (match, index, matches) =>
        matches.findIndex(
          (candidate) => candidate.toLowerCase() === match.toLowerCase(),
        ) === index,
    );

  if (evidence.length === 0) {
    return undefined;
  }

  return {
    code: "URGENCY",
    title: "Urgent action requested",
    explanation:
      "The message uses urgency or pressure language to encourage immediate action.",
    severity: "medium",
    evidence,
    scoreContribution: 15,
  };
}
