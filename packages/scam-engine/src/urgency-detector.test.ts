import { describe, expect, it } from "vitest";

import type { ScamAnalysisInput } from "@kiwi-scamcheck/contracts";

import { analyseMessage } from "./index";
import { detectUrgency } from "./urgency-detector";

function input(text: string): ScamAnalysisInput {
  return { text, channel: "unknown" };
}

describe("detectUrgency", () => {
  it("detects a lowercase urgency phrase", () => {
    const result = analyseMessage(
      input("Please act now to keep your account open."),
    );

    expect(result.riskScore).toBe(15);

    expect(result.signals[0]).toEqual({
      code: "URGENCY",
      title: "Urgent action requested",
      explanation:
        "The message uses urgency or pressure language to encourage immediate action.",
      severity: "medium",
      evidence: ["act now"],
      scoreContribution: 15,
    });
  });

  it("matches uppercase and mixed-case phrases", () => {
    const signal = detectUrgency(
      input("URGENT: Act Immediately to respond."),
    );

    expect(signal?.evidence).toEqual([
      "URGENT",
      "Act Immediately",
    ]);
  });

  it("returns multiple urgency phrases without duplicate evidence", () => {
    const signal = detectUrgency(
      input("Final warning: act now within 24 hours. ACT NOW."),
    );

    expect(signal?.evidence).toEqual([
      "Final warning",
      "act now",
      "within 24 hours",
    ]);
  });

  it("returns no signal for a legitimate message without urgency", () => {
    expect(
      detectUrgency(
        input("Your library book is ready for collection."),
      ),
    ).toBeUndefined();
  });

  it("returns no signal for empty input", () => {
    expect(detectUrgency(input(""))).toBeUndefined();
  });
});