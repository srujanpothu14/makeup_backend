const {
  ScanCommand,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} = require('@aws-sdk/lib-dynamodb');
const { dynamo } = require('../config/dynamoClient');
const env = require('../config/env');
const { AppError } = require('../utils/appError');

function assertOffersTableConfigured() {
  if (!env.offersTableName) {
    throw new AppError(500, 'DYNAMODB_OFFERS_TABLE is required for offer operations');
  }
}

async function listOffers() {
  assertOffersTableConfigured();
  const result = await dynamo.send(
    new ScanCommand({
      TableName: env.offersTableName,
    }),
  );
  return Array.isArray(result.Items) ? result.Items : [];
}

async function findByOfferId(offerId) {
  assertOffersTableConfigured();
  const result = await dynamo.send(
    new GetCommand({
      TableName: env.offersTableName,
      Key: { offer_id: offerId },
    }),
  );
  return result.Item || null;
}

async function createOffer(offer) {
  assertOffersTableConfigured();
  await dynamo.send(
    new PutCommand({
      TableName: env.offersTableName,
      Item: offer,
      ConditionExpression: 'attribute_not_exists(offer_id)',
    }),
  );
}

async function updateOffer(offerId, updates) {
  assertOffersTableConfigured();

  const attributes = [];
  const expressionNames = {};
  const expressionValues = {};

  if (updates.title !== undefined) {
    attributes.push('#title = :title');
    expressionNames['#title'] = 'title';
    expressionValues[':title'] = updates.title;
  }
  if (updates.description !== undefined) {
    attributes.push('#description = :description');
    expressionNames['#description'] = 'description';
    expressionValues[':description'] = updates.description;
  }
  if (updates.serviceId !== undefined) {
    attributes.push('#serviceId = :serviceId');
    expressionNames['#serviceId'] = 'serviceId';
    expressionValues[':serviceId'] = updates.serviceId;
  }
  if (updates.discountPercent !== undefined) {
    attributes.push('#discountPercent = :discountPercent');
    expressionNames['#discountPercent'] = 'discountPercent';
    expressionValues[':discountPercent'] = updates.discountPercent;
  }

  if (attributes.length === 0) {
    return findByOfferId(offerId);
  }

  const result = await dynamo.send(
    new UpdateCommand({
      TableName: env.offersTableName,
      Key: { offer_id: offerId },
      UpdateExpression: `SET ${attributes.join(', ')}`,
      ExpressionAttributeNames: expressionNames,
      ExpressionAttributeValues: expressionValues,
      ConditionExpression: 'attribute_exists(offer_id)',
      ReturnValues: 'ALL_NEW',
    }),
  );

  return result.Attributes || null;
}

async function deleteOffer(offerId) {
  assertOffersTableConfigured();
  await dynamo.send(
    new DeleteCommand({
      TableName: env.offersTableName,
      Key: { offer_id: offerId },
      ConditionExpression: 'attribute_exists(offer_id)',
    }),
  );
}

module.exports = {
  listOffers,
  findByOfferId,
  createOffer,
  updateOffer,
  deleteOffer,
};
