const { GetCommand, PutCommand, UpdateCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { dynamo } = require('../config/dynamoClient');
const env = require('../config/env');
const { AppError } = require('../utils/appError');

const BUSINESS_DETAILS_KEY = 'business';
const BUSINESS_DETAILS_KEY_NAME = 'details_id';

function assertBusinessDetailsTableConfigured() {
  if (!env.businessDetailsTableName) {
    throw new AppError(500, 'DYNAMODB_BUSINESS_DETAILS_TABLE is required for business details operations');
  }
}

function isValidationException(error) {
  return (
    error &&
    (error.name === 'ValidationException' ||
      String(error.__type || '').includes('ValidationException'))
  );
}

async function getFirstBusinessDetailsItem() {
  const result = await dynamo.send(
    new ScanCommand({
      TableName: env.businessDetailsTableName,
      Limit: 1,
    }),
  );
  return (result.Items && result.Items[0]) || null;
}

async function getBusinessDetails() {
  assertBusinessDetailsTableConfigured();

  try {
    const result = await dynamo.send(
      new GetCommand({
        TableName: env.businessDetailsTableName,
        Key: { [BUSINESS_DETAILS_KEY_NAME]: BUSINESS_DETAILS_KEY },
      }),
    );
    return result.Item || null;
  } catch (error) {
    if (isValidationException(error)) {
      return getFirstBusinessDetailsItem();
    }
    throw error;
  }
}

async function getBusinessDetailsById(businessId) {
  assertBusinessDetailsTableConfigured();
  if (!businessId) {
    throw new AppError(400, 'Business id is required');
  }

  const candidateKeyNames = ['id', 'business_id', 'details_id', 'businessId', 'businessID'];
  for (const keyName of candidateKeyNames) {
    try {
      const result = await dynamo.send(
        new GetCommand({
          TableName: env.businessDetailsTableName,
          Key: { [keyName]: businessId },
        }),
      );
      if (result.Item) {
        return result.Item;
      }
    } catch (error) {
      if (!isValidationException(error)) {
        throw error;
      }
    }
  }

  const result = await dynamo.send(
    new ScanCommand({
      TableName: env.businessDetailsTableName,
      FilterExpression:
        '#id = :id OR #business_id = :id OR #details_id = :id OR #businessId = :id OR #businessID = :id',
      ExpressionAttributeNames: {
        '#id': 'id',
        '#business_id': 'business_id',
        '#details_id': 'details_id',
        '#businessId': 'businessId',
        '#businessID': 'businessID',
      },
      ExpressionAttributeValues: {
        ':id': businessId,
      },
      Limit: 1,
    }),
  );

  return (result.Items && result.Items[0]) || null;
}

async function upsertBusinessDetails(details) {
  assertBusinessDetailsTableConfigured();

  const item = {
    [BUSINESS_DETAILS_KEY_NAME]: BUSINESS_DETAILS_KEY,
    ...details,
  };

  try {
    await dynamo.send(
      new PutCommand({
        TableName: env.businessDetailsTableName,
        Item: item,
      }),
    );
    return item;
  } catch (error) {
    if (isValidationException(error)) {
      const existing = await getFirstBusinessDetailsItem();
      if (!existing) {
        throw new AppError(
          500,
          'Unable to write business details: table key schema does not match expected layout',
        );
      }
      const merged = { ...existing, ...details };
      await dynamo.send(
        new PutCommand({
          TableName: env.businessDetailsTableName,
          Item: merged,
        }),
      );
      return merged;
    }
    throw error;
  }
}

async function updateBusinessDetails(updates) {
  assertBusinessDetailsTableConfigured();

  const updateEntries = Object.entries(updates).filter(([, value]) => value !== undefined);
  if (updateEntries.length === 0) {
    return getBusinessDetails();
  }

  const expressionNames = {};
  const expressionValues = {};
  const updatesList = [];

  updateEntries.forEach(([key, value]) => {
    const attributeName = `#${key}`;
    const valueName = `:${key}`;
    expressionNames[attributeName] = key;
    expressionValues[valueName] = value;
    updatesList.push(`${attributeName} = ${valueName}`);
  });

  try {
    const result = await dynamo.send(
      new UpdateCommand({
        TableName: env.businessDetailsTableName,
        Key: { [BUSINESS_DETAILS_KEY_NAME]: BUSINESS_DETAILS_KEY },
        UpdateExpression: `SET ${updatesList.join(', ')}`,
        ExpressionAttributeNames: expressionNames,
        ExpressionAttributeValues: expressionValues,
        ReturnValues: 'ALL_NEW',
      }),
    );
    return result.Attributes || null;
  } catch (error) {
    if (isValidationException(error)) {
      const existing = await getFirstBusinessDetailsItem();
      if (!existing) {
        const item = {
          [BUSINESS_DETAILS_KEY_NAME]: BUSINESS_DETAILS_KEY,
          ...updates,
        };
        await dynamo.send(
          new PutCommand({
            TableName: env.businessDetailsTableName,
            Item: item,
          }),
        );
        return item;
      }

      const merged = { ...existing, ...updates };
      await dynamo.send(
        new PutCommand({
          TableName: env.businessDetailsTableName,
          Item: merged,
        }),
      );
      return merged;
    }
    throw error;
  }
}

module.exports = {
  getBusinessDetails,
  getBusinessDetailsById,
  upsertBusinessDetails,
  updateBusinessDetails,
};
