const { ScanCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { dynamo } = require('../config/dynamoClient');
const env = require('../config/env');
const { AppError } = require('../utils/appError');

function assertServicesTableConfigured() {
  if (!env.servicesTableName) {
    throw new AppError(500, 'DYNAMODB_SERVICES_TABLE is required for service operations');
  }
}

async function listServices() {
  assertServicesTableConfigured();
  const result = await dynamo.send(
    new ScanCommand({
      TableName: env.servicesTableName,
    }),
  );
  return Array.isArray(result.Items) ? result.Items : [];
}

async function findByServiceId(serviceId) {
  assertServicesTableConfigured();
  const result = await dynamo.send(
    new GetCommand({
      TableName: env.servicesTableName,
      Key: { service_id: serviceId },
    }),
  );
  return result.Item || null;
}

async function createService(service) {
  assertServicesTableConfigured();
  await dynamo.send(
    new PutCommand({
      TableName: env.servicesTableName,
      Item: service,
      ConditionExpression: 'attribute_not_exists(service_id)',
    }),
  );
}

async function updateService(serviceId, updates) {
  assertServicesTableConfigured();

  const expressionNames = {};
  const expressionValues = {};
  const updatesList = [];

  if (updates.title !== undefined) {
    expressionNames['#title'] = 'title';
    expressionValues[':title'] = updates.title;
    updatesList.push('#title = :title');
  }
  if (updates.category !== undefined) {
    expressionNames['#category'] = 'category';
    expressionValues[':category'] = updates.category;
    updatesList.push('#category = :category');
  }
  if (updates.durationMin !== undefined) {
    expressionNames['#durationMin'] = 'durationMin';
    expressionValues[':durationMin'] = updates.durationMin;
    updatesList.push('#durationMin = :durationMin');
  }
  if (updates.price !== undefined) {
    expressionNames['#price'] = 'price';
    expressionValues[':price'] = updates.price;
    updatesList.push('#price = :price');
  }
  if (updates.description !== undefined) {
    expressionNames['#description'] = 'description';
    expressionValues[':description'] = updates.description;
    updatesList.push('#description = :description');
  }
  if (updates.thumbnailUrl !== undefined) {
    expressionNames['#thumbnailUrl'] = 'thumbnailUrl';
    expressionValues[':thumbnailUrl'] = updates.thumbnailUrl;
    updatesList.push('#thumbnailUrl = :thumbnailUrl');
  }
  if (updates.artistId !== undefined) {
    expressionNames['#artistId'] = 'artistId';
    expressionValues[':artistId'] = updates.artistId;
    updatesList.push('#artistId = :artistId');
  }

  if (updatesList.length === 0) {
    return findByServiceId(serviceId);
  }

  const result = await dynamo.send(
    new UpdateCommand({
      TableName: env.servicesTableName,
      Key: { service_id: serviceId },
      UpdateExpression: `SET ${updatesList.join(', ')}`,
      ExpressionAttributeNames: expressionNames,
      ExpressionAttributeValues: expressionValues,
      ConditionExpression: 'attribute_exists(service_id)',
      ReturnValues: 'ALL_NEW',
    }),
  );

  return result.Attributes || null;
}

async function deleteService(serviceId) {
  assertServicesTableConfigured();
  await dynamo.send(
    new DeleteCommand({
      TableName: env.servicesTableName,
      Key: { service_id: serviceId },
      ConditionExpression: 'attribute_exists(service_id)',
    }),
  );
}

module.exports = {
  listServices,
  findByServiceId,
  createService,
  updateService,
  deleteService,
};
