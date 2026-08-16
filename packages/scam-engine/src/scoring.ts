import type {
  RiskLevel,
  RiskSignal,
} from "@kiwi-scamcheck/contracts";

export interface RiskScore {
  riskScore: number;
  riskLevel: RiskLevel;
}

export function scoreSignals(signals: readonly RiskSignal[]): RiskScore {
  const riskScore = Math.min(
    signals.reduce(
      (total, signal) => total + signal.scoreContribution,
      0,
    ),
    100,
  );

  let riskLevel: RiskLevel = "low";

  if (riskScore >= 60) {
    riskLevel = "high";
  } else if (riskScore >= 25) {
    riskLevel = "medium";
  }

  return { riskScore, riskLevel };
}
