const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
const env = require('./env');

const hasStaticCredentials = !!(env.awsAccessKeyId && env.awsSecretAccessKey);

const client = new DynamoDBClient({
  region: env.awsRegion,
  endpoint: env.dynamoEndpoint,
  credentials: hasStaticCredentials
    ? {
        accessKeyId: env.awsAccessKeyId,
        secretAccessKey: env.awsSecretAccessKey,
        sessionToken: env.awsSessionToken || undefined,
      }
    : undefined,
});

const dynamo = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
  },
});

module.exports = { dynamo };
