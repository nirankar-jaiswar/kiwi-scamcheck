import type { FeedbackRequest } from "@kiwi-scamcheck/contracts";

interface ApiGatewayEvent {
    body: string | null;
}

export async function handler(event: ApiGatewayEvent) {
    if(!event.body) {
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Kiwi ScamCheck Feedback API is running",
        }),
    };
    }
    const feedback = JSON.parse(event.body) as FeedbackRequest;

    return{
        statusCode: 200,
        body: JSON.stringify({
            received: feedback,
        }),
    };
}
