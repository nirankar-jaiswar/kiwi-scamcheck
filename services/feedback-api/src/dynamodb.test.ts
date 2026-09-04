import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { afterEach, describe, expect, it, vi } from "vitest";

import { saveFeedback } from "./dynamodb";

describe("saveFeedback", () => {
    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it("throws when FEEDBACK_TABLE_NAME is not configured", async () => {
        vi.stubEnv("FEEDBACK_TABLE_NAME", "");

        const feedback = {
            feedbackId: "feedback-123",
            createdAt: "2026-08-28T00:00:00.000Z",
            riskLevel: "high" as const,
            signalCodes: ["URGENCY"],
            helpful: true,
            engineVersion: "0.1.0",
        };

        const fakeClient = {
            send: vi
                .fn<(command: PutCommand) => Promise<unknown>>()
                .mockResolvedValue({}),
        };

        await expect(
            saveFeedback(feedback, fakeClient),
        ).rejects.toThrow(
            "FEEDBACK_TABLE_NAME is not configured",
        );

        expect(fakeClient.send).not.toHaveBeenCalled();
    });

    it("sends the feedback record to DynamoDB", async () => {
        vi.stubEnv(
            "FEEDBACK_TABLE_NAME",
            "KiwiScamCheckFeedback",
        );

        const feedback = {
            feedbackId: "feedback-123",
            createdAt: "2026-08-28T00:00:00.000Z",
            riskLevel: "high" as const,
            signalCodes: ["URGENCY", "SUSPICIOUS_URL"],
            helpful: true,
            engineVersion: "0.1.0",
        };

        const fakeClient = {
            send: vi
                .fn<(command: PutCommand) => Promise<unknown>>()
                .mockResolvedValue({}),
        };

        await saveFeedback(feedback, fakeClient);

        expect(fakeClient.send).toHaveBeenCalledTimes(1);

        expect(fakeClient.send).toHaveBeenCalledWith(
            expect.objectContaining({
                input: {
                    TableName: "KiwiScamCheckFeedback",
                    Item: feedback,
                    ConditionExpression:
                        "attribute_not_exists(feedbackId)",
                },
            }),
        );
    });
});