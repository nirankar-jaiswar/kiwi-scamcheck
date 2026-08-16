export type ScamChannel = 
| "sms"
| "email"
| "social"
| "marketplace"
| "unknown";

export type RiskSeverity =
| "low"
| "medium"
| "high"
| "critical";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface ScamAnalysisInput {
    text: string;
    channel: ScamChannel;
}

export interface RiskSignal {
  code: string;
  title: string;
  explanation: string;
  severity: RiskSeverity;
  evidence: string[];
  scoreContribution: number;
}

export interface ScamAnalysisResult {
    riskScore: number;
    riskLevel: RiskLevel;
    signals: RiskSignal[];
    recommendedActions: string[];
    engineVersion: string;
}
