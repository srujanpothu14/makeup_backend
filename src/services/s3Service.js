const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');
const { s3 } = require('../config/s3Client');
const env = require('../config/env');
const { AppError } = require('../utils/appError');

function assertS3Configured() {
  if (!env.s3Bucket) {
    throw new AppError(500, 'AWS_S3_BUCKET is required for gallery media uploads');
  }
}

function sanitizeFileName(fileName) {
  const baseName = path.basename(String(fileName || 'media'));
  const sanitized = baseName.replace(/[^a-zA-Z0-9._-]/g, '_');
  return sanitized || 'media';
}

function buildGalleryKey(mediaId, fileName) {
  const prefix = String(env.s3GalleryPrefix || 'gallery/').replace(/^\/+/, '');
  const normalizedPrefix = prefix.endsWith('/') ? prefix : `${prefix}/`;
  return `${normalizedPrefix}${mediaId}/${sanitizeFileName(fileName)}`;
}

function getPublicUrl(key) {
  const encodedKey = String(key)
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  if (env.s3PublicUrl) {
    return `${String(env.s3PublicUrl).replace(/\/+$/, '')}/${encodedKey}`;
  }

  return `https://${env.s3Bucket}.s3.${env.awsRegion}.amazonaws.com/${encodedKey}`;
}

async function uploadFile({ key, body, contentType }) {
  assertS3Configured();

  await s3.send(
    new PutObjectCommand({
      Bucket: env.s3Bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );

  return getPublicUrl(key);
}

async function deleteFile(key) {
  assertS3Configured();
  if (!key) return;

  await s3.send(
    new DeleteObjectCommand({
      Bucket: env.s3Bucket,
      Key: key,
    }),
  );
}

module.exports = {
  buildGalleryKey,
  getPublicUrl,
  uploadFile,
  deleteFile,
};
