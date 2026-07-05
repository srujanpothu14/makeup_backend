const { ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { dynamo } = require('../config/dynamoClient');
const env = require('../config/env');
const { AppError } = require('../utils/appError');

function assertReviewsTableConfigured() {
  if (!env.reviewsTableName) {
    throw new AppError(500, 'DYNAMODB_REVIEWS_TABLE is required for review operations');
  }
}

async function listReviews() {
  assertReviewsTableConfigured();
  const result = await dynamo.send(
    new ScanCommand({
      TableName: env.reviewsTableName,
    }),
  );
  return Array.isArray(result.Items) ? result.Items : [];
}

module.exports = {
  listReviews,
};
