const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  port: Number(process.env.PORT || 5000),
  jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  awsRegion: process.env.AWS_REGION || 'ap-south-1',
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  awsSessionToken: process.env.AWS_SESSION_TOKEN || '',
  usersTableName: process.env.DYNAMODB_USERS_TABLE || '',
  servicesTableName: process.env.DYNAMODB_SERVICES_TABLE || '',
  offersTableName: process.env.DYNAMODB_OFFERS_TABLE || '',
  businessDetailsTableName: process.env.DYNAMODB_BUSINESS_DETAILS_TABLE || '',
  bookingsTableName: process.env.DYNAMODB_BOOKINGS_TABLE || '',
  galleryTableName: process.env.DYNAMODB_GALLERY_TABLE || '',
  reviewsTableName: process.env.DYNAMODB_REVIEWS_TABLE || '',
  s3Bucket: process.env.AWS_S3_BUCKET || '',
  s3GalleryPrefix: process.env.AWS_S3_GALLERY_PREFIX || 'gallery/',
  s3PublicUrl: process.env.AWS_S3_PUBLIC_URL || '',
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS || 10),
  dynamoEndpoint: process.env.AWS_DYNAMODB_ENDPOINT || undefined,
};
