import { describe, expect, it } from "vitest";

import type { RiskSignal } from "@kiwi-scamcheck/contracts";

import { scoreSignals } from "./scoring";

function signal(scoreContribution: number): RiskSignal {
  return {
    code: "TEST",
    title: "Test signal",
    explanation: "Test signal for scoring.",
    severity: "medium",
    evidence: [],
    scoreContribution,
  };
}

describe("scoreSignals", () => {
  it("returns score 0 and low risk for no signals", () => {
    expect(scoreSignals([])).toEqual({ riskScore: 0, riskLevel: "low" });
  });

  it("scores one signal", () => {
    expect(scoreSignals([signal(15)])).toEqual({
      riskScore: 15,
      riskLevel: "low",
    });
  });

  it("sums multiple signals", () => {
    expect(scoreSignals([signal(15), signal(20)])).toEqual({
      riskScore: 35,
      riskLevel: "medium",
    });
  });

  it.each([
    [24, "low"],
    [25, "medium"],
    [59, "medium"],
    [60, "high"],
  ] as const)("maps boundary score %i to %s", (score, riskLevel) => {
    expect(scoreSignals([signal(score)])).toEqual({
      riskScore: score,
      riskLevel,
    });
  });

  it("caps totals above 100", () => {
    expect(scoreSignals([signal(70), signal(45)])).toEqual({
      riskScore: 100,
      riskLevel: "high",
    });
  });
});
