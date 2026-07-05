const { ScanCommand, GetCommand, PutCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
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

async function findByMediaId(mediaId) {
  assertGalleryTableConfigured();
  const result = await dynamo.send(
    new GetCommand({
      TableName: env.galleryTableName,
      Key: { media_id: mediaId },
    }),
  );
  return result.Item || null;
}

async function createGalleryMedia(media) {
  assertGalleryTableConfigured();
  await dynamo.send(
    new PutCommand({
      TableName: env.galleryTableName,
      Item: media,
      ConditionExpression: 'attribute_not_exists(media_id)',
    }),
  );
}

async function updateGalleryMedia(media) {
  assertGalleryTableConfigured();
  await dynamo.send(
    new PutCommand({
      TableName: env.galleryTableName,
      Item: media,
      ConditionExpression: 'attribute_exists(media_id)',
    }),
  );
}

async function deleteGalleryMedia(mediaId) {
  assertGalleryTableConfigured();
  await dynamo.send(
    new DeleteCommand({
      TableName: env.galleryTableName,
      Key: { media_id: mediaId },
      ConditionExpression: 'attribute_exists(media_id)',
    }),
  );
}

module.exports = {
  listGalleryMedia,
  findByMediaId,
  createGalleryMedia,
  updateGalleryMedia,
  deleteGalleryMedia,
};
