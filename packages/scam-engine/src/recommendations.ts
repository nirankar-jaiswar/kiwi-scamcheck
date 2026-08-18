import type { RiskSignal } from "@kiwi-scamcheck/contracts";

const NEUTRAL_RECOMMENDATION =
  "No strong warning signs were detected by the current checks. Continue to use normal caution and verify unexpected requests independently.";

const RECOMMENDATIONS_BY_SIGNAL = [
  {
    code: "CREDENTIAL_REQUEST",
    actions: [
      "Do not provide passwords, PINs, OTPs, verification codes, or other authentication information.",
      "Contact the organisation using a trusted phone number, app, or website if verification is needed.",
    ],
  },
  {
    code: "SUSPICIOUS_URL",
    actions: [
      "Do not open or continue using the supplied link.",
      "Open the organisation's official website or app independently instead.",
    ],
  },
  {
    code: "URGENCY",
    actions: [
      "Do not let urgency or pressure force you into acting before verifying the request.",
    ],
  },
] as const;

export function generateRecommendations(
  signals: readonly RiskSignal[],
): string[] {
  const signalCodes = new Set(signals.map((signal) => signal.code));
  const recommendations = RECOMMENDATIONS_BY_SIGNAL.flatMap(({ code, actions }) =>
    signalCodes.has(code) ? actions : [],
  );

  if (recommendations.length === 0) {
    return [NEUTRAL_RECOMMENDATION];
  }

  return [...new Set(recommendations)];
}
