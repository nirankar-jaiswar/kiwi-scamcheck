import { describe, expect, it, vi } from "vitest";

import { createHandler } from "./handler";

import type { FeedbackRecord } from "./feedback-record";

describe("feedback API handler", () => {
    const createTestHandler = () =>
        createHandler({
            saveFeedback: vi
                .fn<(feedback: FeedbackRecord) => Promise<void>>()
                .mockResolvedValue(),
        });

    it("returns 400 when request body is missing", async () => {
        const handler = createTestHandler();

        const response = await handler({
            body: null,
        });

        expect(response.statusCode).toBe(400);
    });

    it("returns 400 when request body contains malformed JSON", async () => {
        const handler = createTestHandler();

        const response = await handler({
            body: '{"helpful":',
        });

        expect(response.statusCode).toBe(400);
    });

    it("returns 422 when request body has invalid feedback structure", async () => {
        const handler = createTestHandler();

        const response = await handler({
            body: JSON.stringify({
                riskLevel: "banana",
                signalCodes: 123,
                helpful: "yes",
                engineVersion: null,
            }),
        });

        expect(response.statusCode).toBe(422);
    });

    it("returns 200 with feedbackId and createdAt for valid feedback", async () => {
        const fakeSaveFeedback = vi
            .fn<(feedback: FeedbackRecord) => Promise<void>>()
            .mockResolvedValue();

        const handler = createHandler({
            saveFeedback: fakeSaveFeedback,
        });

        const response = await handler({
            body: JSON.stringify({
                riskLevel: "high",
                signalCodes: [
                    "URGENCY",
                    "CREDENTIAL_REQUEST",
                ],
                helpful: true,
                engineVersion: "0.1.0",
            }),
        });

        expect(response.statusCode).toBe(200);

        const body = JSON.parse(response.body);

        expect(typeof body.feedbackId).toBe("string");
        expect(body.feedbackId.length).toBeGreaterThan(0);

        expect(typeof body.createdAt).toBe("string");
        expect(body.createdAt.length).toBeGreaterThan(0);

        expect(fakeSaveFeedback).toHaveBeenCalledTimes(1);

        expect(fakeSaveFeedback).toHaveBeenCalledWith(
            expect.objectContaining({
                feedbackId: body.feedbackId,
                createdAt: body.createdAt,
                riskLevel: "high",
                signalCodes: [
                    "URGENCY",
                    "CREDENTIAL_REQUEST",
                ],
                helpful: true,
                engineVersion: "0.1.0",
            }),
        );
    });

    it("returns 422 when riskLevel is invalid", async () => {
        const handler = createTestHandler();

        const response = await handler({
            body: JSON.stringify({
                riskLevel: "critical",
                signalCodes: ["URGENCY"],
                helpful: true,
                engineVersion: "0.1.0",
            }),
        });

        expect(response.statusCode).toBe(422);
    });

    it("returns 422 when signalCodes is not an array", async () => {
        const handler = createTestHandler();

        const response = await handler({
            body: JSON.stringify({
                riskLevel: "high",
                signalCodes: "URGENCY",
                helpful: true,
                engineVersion: "0.1.0",
            }),
        });

        expect(response.statusCode).toBe(422);
    });

    it("returns 422 when signalCodes contains a non-string value", async () => {
        const handler = createTestHandler();

        const response = await handler({
            body: JSON.stringify({
                riskLevel: "high",
                signalCodes: ["URGENCY", 123],
                helpful: true,
                engineVersion: "0.1.0",
            }),
        });

        expect(response.statusCode).toBe(422);
    });

    it("returns 422 when helpful is not a boolean", async () => {
        const handler = createTestHandler();

        const response = await handler({
            body: JSON.stringify({
                riskLevel: "high",
                signalCodes: ["URGENCY"],
                helpful: "yes",
                engineVersion: "0.1.0",
            }),
        });

        expect(response.statusCode).toBe(422);
    });

    it("returns 422 when engineVersion is empty", async () => {
        const handler = createTestHandler();

        const response = await handler({
            body: JSON.stringify({
                riskLevel: "high",
                signalCodes: ["URGENCY"],
                helpful: true,
                engineVersion: "",
            }),
        });

        expect(response.statusCode).toBe(422);
    });

    it("returns 422 when there are too many signal codes", async () => {
        const handler = createTestHandler();

        const response = await handler({
            body: JSON.stringify({
                riskLevel: "high",
                signalCodes: Array(21).fill("URGENCY"),
                helpful: true,
                engineVersion: "0.1.0",
            }),
        });

        expect(response.statusCode).toBe(422);
    });

    it("returns 422 when a signal code is too long", async () => {
        const handler = createTestHandler();

        const response = await handler({
            body: JSON.stringify({
                riskLevel: "high",
                signalCodes: ["A".repeat(65)],
                helpful: true,
                engineVersion: "0.1.0",
            }),
        });

        expect(response.statusCode).toBe(422);
    });

    it("returns 422 when a signal code is empty", async () => {
        const handler = createTestHandler();

        const response = await handler({
            body: JSON.stringify({
                riskLevel: "high",
                signalCodes: [""],
                helpful: true,
                engineVersion: "0.1.0",
            }),
        });

        expect(response.statusCode).toBe(422);
    });

    it("returns 422 when engineVersion is too long", async () => {
        const handler = createTestHandler();

        const response = await handler({
            body: JSON.stringify({
                riskLevel: "high",
                signalCodes: ["URGENCY"],
                helpful: true,
                engineVersion: "1".repeat(33),
            }),
        });

        expect(response.statusCode).toBe(422);
    });

    it("returns 500 when saving feedback fails", async () => {
        const fakeSaveFeedback = vi
            .fn<(feedback: FeedbackRecord) => Promise<void>>()
            .mockRejectedValue(new Error("DynamoDB error"));

        const handler = createHandler({
            saveFeedback: fakeSaveFeedback,
        });

        const response = await handler({
            body: JSON.stringify({
                riskLevel: "high",
                signalCodes: ["URGENCY"],
                helpful: true,
                engineVersion: "0.1.0",
            }),
        });

        expect(response.statusCode).toBe(500);

        expect(JSON.parse(response.body)).toEqual({
            message: "Failed to save feedback",
        });

        expect(fakeSaveFeedback).toHaveBeenCalledTimes(1);
    });
});