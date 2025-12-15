import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { randomUUID } from 'crypto';

const dynamodb = new DynamoDBClient({});
const lambda = new LambdaClient({});

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { messages, responseFormat, model } = JSON.parse(event.body || '{}');

    // Generate unique job ID
    const jobId = randomUUID();

    // Store job in DynamoDB
    await dynamodb.send(new PutItemCommand({
      TableName: process.env.JOBS_TABLE!,
      Item: {
        jobId: { S: jobId },
        status: { S: 'processing' },
        createdAt: { N: Date.now().toString() },
        ttl: { N: Math.floor(Date.now() / 1000 + 86400).toString() }, // 24 hours TTL
      },
    }));

    // Invoke worker Lambda asynchronously
    await lambda.send(new InvokeCommand({
      FunctionName: process.env.AWS_LAMBDA_FUNCTION_NAME!.replace('submitJob', 'processOpenAIWorker'),
      InvocationType: 'Event', // Async invocation
      Payload: Buffer.from(JSON.stringify({ jobId, messages, responseFormat, model })),
    }));

    console.log(`Job ${jobId} submitted`);

    return {
      statusCode: 202, // Accepted
      headers,
      body: JSON.stringify({ jobId, status: 'processing' }),
    };

  } catch (error) {
    console.error('Error submitting job:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
