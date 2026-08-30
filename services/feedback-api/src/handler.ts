import type {
    FeedbackRequest,
    FeedbackResponse,
} from "@kiwi-scamcheck/contracts";

import { saveFeedback } from "./dynamodb";

import type { FeedbackRecord } from "./feedback-record";

interface ApiGatewayEvent {
    body: string | null;
}

const MAX_SIGNAL_CODES = 10;
const MAX_SIGNAL_CODE_LENGTH = 64;
const MAX_ENGINE_VERSION_LENGTH = 32;

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

function isFeedbackRequest(value: unknown): value is FeedbackRequest {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const feedback = value as Record<string, unknown>;

    const validRiskLevels = ["low", "medium", "high"];

    if (
        typeof feedback.riskLevel !== "string" ||
        !validRiskLevels.includes(feedback.riskLevel)
    ) {
        return false;
    }

    if (
        !Array.isArray(feedback.signalCodes) ||
        feedback.signalCodes.length > MAX_SIGNAL_CODES ||
        !feedback.signalCodes.every(
            (code) =>
                typeof code === "string" &&
                code.length > 0 &&
                code.length <= MAX_SIGNAL_CODE_LENGTH,
        )
    ) {
        return false;
    }

    if (typeof feedback.helpful !== "boolean") {
        return false;
    }

    if (
        typeof feedback.engineVersion !== "string" ||
        feedback.engineVersion.trim().length === 0 ||
        feedback.engineVersion.length > MAX_ENGINE_VERSION_LENGTH
    ) {
        return false;
    }

    return true;
}

interface HandlerDependencies {
    saveFeedback: (feedback: FeedbackRecord) => Promise<void>;
}

export function createHandler(dependencies: HandlerDependencies) {
    return async function handleFeedback(event: ApiGatewayEvent) {
        if (!event.body) {
            return {
                statusCode: 400,
                headers: CORS_HEADERS,
                body: JSON.stringify({
                    message: "Request body is required",
                }),
            };
        }

        let parsedBody: unknown;

        try {
            parsedBody = JSON.parse(event.body);
        } catch {
            return {
                statusCode: 400,
                headers: CORS_HEADERS,
                body: JSON.stringify({
                    message: "Request body must contain valid JSON",
                }),
            };
        }

        if (!isFeedbackRequest(parsedBody)) {
            return {
                statusCode: 422,
                headers: CORS_HEADERS,
                body: JSON.stringify({
                    message: "Invalid feedback request",
                }),
            };
        }

        const feedbackId = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        const feedbackRecord: FeedbackRecord = {
            feedbackId,
            createdAt,
            riskLevel: parsedBody.riskLevel,
            signalCodes: parsedBody.signalCodes,
            helpful: parsedBody.helpful,
            engineVersion: parsedBody.engineVersion,
        };

        try {
            await dependencies.saveFeedback(feedbackRecord);
        } catch (error) {
            console.error("Failed to persist feedback", error);

            return {
                statusCode: 500,
                headers: CORS_HEADERS,
                body: JSON.stringify({
                    message: "Failed to save feedback",
                }),
            };
        }

        const response: FeedbackResponse = {
            feedbackId,
            createdAt,
        };

        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify(response),
        };
    };
}

export const handler = createHandler({
    saveFeedback,
});