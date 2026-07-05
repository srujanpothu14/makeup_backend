const { ScanCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { dynamo } = require('../config/dynamoClient');
const env = require('../config/env');
const { AppError } = require('../utils/appError');

function assertBookingsTableConfigured() {
  if (!env.bookingsTableName) {
    throw new AppError(500, 'DYNAMODB_BOOKINGS_TABLE is required for booking operations');
  }
}

async function createBooking(booking) {
  assertBookingsTableConfigured();
  await dynamo.send(
    new PutCommand({
      TableName: env.bookingsTableName,
      Item: booking,
      ConditionExpression: 'attribute_not_exists(booking_id)',
    }),
  );
  return booking;
}

async function listBookings() {
  assertBookingsTableConfigured();
  const result = await dynamo.send(
    new ScanCommand({
      TableName: env.bookingsTableName,
    }),
  );
  return Array.isArray(result.Items) ? result.Items : [];
}

module.exports = {
  createBooking,
  listBookings,
};
