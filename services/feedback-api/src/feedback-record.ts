import type { RiskLevel } from "@kiwi-scamcheck/contracts";

export interface FeedbackRecord {
    feedbackId: string;
    createdAt: string;
    riskLevel: RiskLevel;
    signalCodes: string[];
    helpful: boolean;
    engineVersion: string;
}