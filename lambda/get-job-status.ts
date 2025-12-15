import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';

const dynamodb = new DynamoDBClient({});

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json',
};

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const jobId = event.pathParameters?.jobId;

    if (!jobId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'jobId is required' }),
      };
    }

    // Get job from DynamoDB
    const response = await dynamodb.send(new GetItemCommand({
      TableName: process.env.JOBS_TABLE!,
      Key: { jobId: { S: jobId } },
    }));

    if (!response.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Job not found' }),
      };
    }

    const status = response.Item.status?.S || 'unknown';
    const result = response.Item.result?.S;
    const error = response.Item.error?.S;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        jobId,
        status,
        ...(result && { result: JSON.parse(result) }),
        ...(error && { error }),
      }),
    };

  } catch (error) {
    console.error('Error getting job status:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
