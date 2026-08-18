import { describe, expect, it } from "vitest";

import type { RiskSignal } from "@kiwi-scamcheck/contracts";

import { generateRecommendations } from "./recommendations";

function signal(code: string): RiskSignal {
  return {
    code,
    title: "Test signal",
    explanation: "Test signal for recommendations.",
    severity: "medium",
    evidence: [],
    scoreContribution: 0,
  };
}

describe("generateRecommendations", () => {
  it("returns neutral advice when there are no signals", () => {
    expect(generateRecommendations([])).toEqual([
      "No strong warning signs were detected by the current checks. Continue to use normal caution and verify unexpected requests independently.",
    ]);
  });

  it("returns advice for urgency only", () => {
    expect(generateRecommendations([signal("URGENCY")])).toEqual([
      "Do not let urgency or pressure force you into acting before verifying the request.",
    ]);
  });

  it("returns advice for a credential request only", () => {
    expect(generateRecommendations([signal("CREDENTIAL_REQUEST")])).toEqual([
      "Do not provide passwords, PINs, OTPs, verification codes, or other authentication information.",
      "Contact the organisation using a trusted phone number, app, or website if verification is needed.",
    ]);
  });

  it("returns advice for a suspicious URL only", () => {
    expect(generateRecommendations([signal("SUSPICIOUS_URL")])).toEqual([
      "Do not open or continue using the supplied link.",
      "Open the organisation's official website or app independently instead.",
    ]);
  });

  it("returns multiple signal recommendations in a stable order", () => {
    expect(
      generateRecommendations([
        signal("URGENCY"),
        signal("SUSPICIOUS_URL"),
        signal("CREDENTIAL_REQUEST"),
      ]),
    ).toEqual([
      "Do not provide passwords, PINs, OTPs, verification codes, or other authentication information.",
      "Contact the organisation using a trusted phone number, app, or website if verification is needed.",
      "Do not open or continue using the supplied link.",
      "Open the organisation's official website or app independently instead.",
      "Do not let urgency or pressure force you into acting before verifying the request.",
    ]);
  });

  it("removes duplicate recommendations", () => {
    expect(
      generateRecommendations([
        signal("CREDENTIAL_REQUEST"),
        signal("CREDENTIAL_REQUEST"),
      ]),
    ).toEqual([
      "Do not provide passwords, PINs, OTPs, verification codes, or other authentication information.",
      "Contact the organisation using a trusted phone number, app, or website if verification is needed.",
    ]);
  });
});
