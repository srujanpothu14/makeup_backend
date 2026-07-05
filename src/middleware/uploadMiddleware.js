const multer = require('multer');
const { AppError } = require('../utils/appError');

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const ALLOWED_VIDEO_TYPES = new Set(['video/mp4', 'video/webm', 'video/quicktime']);
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_VIDEO_SIZE,
  },
  fileFilter(_req, file, callback) {
    const mimeType = String(file.mimetype || '').toLowerCase();
    const isAllowed = ALLOWED_IMAGE_TYPES.has(mimeType) || ALLOWED_VIDEO_TYPES.has(mimeType);

    if (!isAllowed) {
      callback(new AppError(400, 'Unsupported file type. Upload an image or video file.'));
      return;
    }

    callback(null, true);
  },
});

function validateUploadedFile(file) {
  if (!file) {
    throw new AppError(400, 'Media file is required');
  }

  const mimeType = String(file.mimetype || '').toLowerCase();
  const isImage = ALLOWED_IMAGE_TYPES.has(mimeType);
  const isVideo = ALLOWED_VIDEO_TYPES.has(mimeType);

  if (!isImage && !isVideo) {
    throw new AppError(400, 'Unsupported file type. Upload an image or video file.');
  }

  if (isImage && file.size > MAX_IMAGE_SIZE) {
    throw new AppError(400, 'Image files must be 10 MB or smaller');
  }

  if (isVideo && file.size > MAX_VIDEO_SIZE) {
    throw new AppError(400, 'Video files must be 100 MB or smaller');
  }

  return mimeType;
}

function detectMediaType(mimeType) {
  return ALLOWED_VIDEO_TYPES.has(mimeType) ? 'video' : 'image';
}

function resolveMediaType(body, mimeType) {
  const rawType = String(body?.type ?? body?.isImageOrVideo ?? '').toLowerCase();
  if (rawType === 'video' || rawType === 'image') {
    return rawType;
  }
  return detectMediaType(mimeType);
}

module.exports = {
  upload,
  validateUploadedFile,
  detectMediaType,
  resolveMediaType,
};
