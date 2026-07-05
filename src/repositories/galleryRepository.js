const { ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { dynamo } = require('../config/dynamoClient');
const env = require('../config/env');
const { AppError } = require('../utils/appError');

function assertGalleryTableConfigured() {
  if (!env.galleryTableName) {
    throw new AppError(500, 'DYNAMODB_GALLERY_TABLE is required for gallery operations');
  }
}

async function listGalleryMedia() {
  assertGalleryTableConfigured();
  const result = await dynamo.send(
    new ScanCommand({
      TableName: env.galleryTableName,
    }),
  );
  return Array.isArray(result.Items) ? result.Items : [];
}

module.exports = {
  listGalleryMedia,
};
