const { ScanCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { dynamo } = require('../config/dynamoClient');
const env = require('../config/env');
const { AppError } = require('../utils/appError');

function assertUsersTableConfigured() {
  if (!env.usersTableName) {
    throw new AppError(500, 'DYNAMODB_USERS_TABLE is required for auth operations');
  }
}

async function findByMobileNumber(mobileNumber) {
  assertUsersTableConfigured();
  const result = await dynamo.send(
    new GetCommand({
      TableName: env.usersTableName,
      Key: { mobile_number: mobileNumber },
    }),
  );
  return result.Item || null;
}

async function createUser(user) {
  assertUsersTableConfigured();
  await dynamo.send(
    new PutCommand({
      TableName: env.usersTableName,
      Item: user,
      ConditionExpression: 'attribute_not_exists(mobile_number)',
    }),
  );
}

async function listUsers() {
  assertUsersTableConfigured();
  const result = await dynamo.send(
    new ScanCommand({
      TableName: env.usersTableName,
    }),
  );
  return Array.isArray(result.Items) ? result.Items : [];
}

async function updateUser(mobileNumber, updates) {
  assertUsersTableConfigured();

  const expressionNames = {};
  const expressionValues = {};
  const updatesList = [];

  if (updates.full_name !== undefined) {
    expressionNames['#full_name'] = 'full_name';
    expressionValues[':full_name'] = updates.full_name;
    updatesList.push('#full_name = :full_name');
  }

  if (updates.password_hash !== undefined) {
    expressionNames['#password_hash'] = 'password_hash';
    expressionValues[':password_hash'] = updates.password_hash;
    updatesList.push('#password_hash = :password_hash');
  }

  if (updatesList.length === 0) {
    return null;
  }

  const result = await dynamo.send(
    new UpdateCommand({
      TableName: env.usersTableName,
      Key: { mobile_number: mobileNumber },
      UpdateExpression: `SET ${updatesList.join(', ')}`,
      ExpressionAttributeNames: expressionNames,
      ExpressionAttributeValues: expressionValues,
      ConditionExpression: 'attribute_exists(mobile_number)',
      ReturnValues: 'ALL_NEW',
    }),
  );

  return result.Attributes || null;
}

async function deleteUser(mobileNumber) {
  assertUsersTableConfigured();
  await dynamo.send(
    new DeleteCommand({
      TableName: env.usersTableName,
      Key: { mobile_number: mobileNumber },
      ConditionExpression: 'attribute_exists(mobile_number)',
    }),
  );
}

module.exports = {
  findByMobileNumber,
  createUser,
  listUsers,
  updateUser,
  deleteUser,
};
