const { S3Client } = require('@aws-sdk/client-s3');
const env = require('./env');

const hasStaticCredentials = !!(env.awsAccessKeyId && env.awsSecretAccessKey);

const s3 = new S3Client({
  region: env.awsRegion,
  credentials: hasStaticCredentials
    ? {
        accessKeyId: env.awsAccessKeyId,
        secretAccessKey: env.awsSecretAccessKey,
        sessionToken: env.awsSessionToken || undefined,
      }
    : undefined,
});

module.exports = { s3 };
