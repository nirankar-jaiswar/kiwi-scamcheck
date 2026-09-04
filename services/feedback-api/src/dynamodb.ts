import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    PutCommand,
} from "@aws-sdk/lib-dynamodb";

import type { FeedbackRecord } from "./feedback-record";

interface DynamoDbWriter {
    send(command: PutCommand): Promise<unknown>;
}

const dynamoDbClient = new DynamoDBClient({});

const documentClient = DynamoDBDocumentClient.from(dynamoDbClient);

export async function saveFeedback(
    feedback: FeedbackRecord,
    client: DynamoDbWriter = documentClient,
): Promise<void> {
    const tableName = process.env.FEEDBACK_TABLE_NAME;

    if (!tableName) {
        throw new Error("FEEDBACK_TABLE_NAME is not configured");
    }

    const command = new PutCommand({
        TableName: tableName,
        Item: feedback,
        ConditionExpression: "attribute_not_exists(feedbackId)",
    });

    await client.send(command);
}