import { Handler } from 'aws-lambda';
import OpenAI from 'openai';
import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const dynamodb = new DynamoDBClient({});

interface WorkerEvent {
  jobId: string;
  messages: Array<{ role: string; content: string }>;
  responseFormat?: { type: string };
  model?: string;
}

export const handler: Handler = async (event: WorkerEvent) => {
  const { jobId, messages, responseFormat, model = 'gpt-5-nano' } = event;

  try {
    console.log(`Processing job ${jobId} with model ${model}`);

    // Call OpenAI API (can take a long time)
    const completion = await openai.chat.completions.create({
      model,
      messages,
      ...(responseFormat && { response_format: responseFormat }),
    });

    const result = {
      content: completion.choices[0].message.content,
      usage: completion.usage,
    };

    // Update DynamoDB with success
    await dynamodb.send(new UpdateItemCommand({
      TableName: process.env.JOBS_TABLE!,
      Key: { jobId: { S: jobId } },
      UpdateExpression: 'SET #status = :status, #result = :result, completedAt = :completedAt',
      ExpressionAttributeNames: {
        '#status': 'status',
        '#result': 'result',
      },
      ExpressionAttributeValues: {
        ':status': { S: 'completed' },
        ':result': { S: JSON.stringify(result) },
        ':completedAt': { N: Date.now().toString() },
      },
    }));

    console.log(`Job ${jobId} completed successfully`);
    return { statusCode: 200, body: 'Job completed' };

  } catch (error) {
    console.error(`Job ${jobId} failed:`, error);

    // Update DynamoDB with failure
    await dynamodb.send(new UpdateItemCommand({
      TableName: process.env.JOBS_TABLE!,
      Key: { jobId: { S: jobId } },
      UpdateExpression: 'SET #status = :status, #error = :error, completedAt = :completedAt',
      ExpressionAttributeNames: {
        '#status': 'status',
        '#error': 'error',
      },
      ExpressionAttributeValues: {
        ':status': { S: 'failed' },
        ':error': { S: error instanceof Error ? error.message : 'Unknown error' },
        ':completedAt': { N: Date.now().toString() },
      },
    }));

    throw error;
  }
};
