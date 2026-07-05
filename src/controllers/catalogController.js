const crypto = require('crypto');
const galleryRepository = require('../repositories/galleryRepository');
const reviewRepository = require('../repositories/reviewRepository');
const s3Service = require('../services/s3Service');
const {
  validateUploadedFile,
  resolveMediaType,
} = require('../middleware/uploadMiddleware');
const { AppError } = require('../utils/appError');

function normalizeMedia(item) {
  const candidate = item || {};
  const url = String(
    candidate.mediaUrl ?? candidate.media_url ?? candidate.mediaURL ?? candidate.url ?? '',
  );
  const rawType = String(candidate.isImageOrVideo ?? candidate.type ?? 'image').toLowerCase();

  return {
    id: String(candidate.media_id ?? candidate.id ?? ''),
    mediaUrl: url,
    media_url: url,
    url,
    isImageOrVideo: rawType === 'video' ? 'video' : 'image',
    type: rawType === 'video' ? 'video' : 'image',
    s3Key: candidate.s3Key ?? candidate.s3_key ?? undefined,
    fileName: candidate.fileName ?? candidate.file_name ?? undefined,
    mimeType: candidate.mimeType ?? candidate.mime_type ?? undefined,
    fileSize: candidate.fileSize ?? candidate.file_size ?? undefined,
    createdAt: candidate.createdAt ?? candidate.created_at ?? undefined,
    updatedAt: candidate.updatedAt ?? candidate.updated_at ?? undefined,
  };
}

async function listGalleryMedia(_req, res) {
  const media = await galleryRepository.listGalleryMedia();
  res.json(media.map(normalizeMedia));
}

async function getGalleryMediaById(req, res) {
  const mediaId = req.params.id;
  const existing = await galleryRepository.findByMediaId(mediaId);
  if (!existing) {
    throw new AppError(404, 'Media not found');
  }

  res.json(normalizeMedia(existing));
}

async function createGalleryMedia(req, res) {
  const body = req.body || {};
  const mediaUrl = body.mediaUrl ?? body.media_url ?? body.url;
  const rawType = String(body.isImageOrVideo ?? body.type ?? 'image').toLowerCase();

  if (!mediaUrl || typeof mediaUrl !== 'string') {
    throw new AppError(400, 'Media URL is required');
  }

  const media = {
    media_id: `m${crypto.randomUUID()}`,
    mediaUrl: String(mediaUrl),
    isImageOrVideo: rawType === 'video' ? 'video' : 'image',
    createdAt: new Date().toISOString(),
  };

  await galleryRepository.createGalleryMedia(media);
  res.status(201).json(normalizeMedia(media));
}

async function uploadGalleryMedia(req, res) {
  const mimeType = validateUploadedFile(req.file);
  const mediaType = resolveMediaType(req.body, mimeType);
  const mediaId = `m${crypto.randomUUID()}`;
  const s3Key = s3Service.buildGalleryKey(mediaId, req.file.originalname);
  const mediaUrl = await s3Service.uploadFile({
    key: s3Key,
    body: req.file.buffer,
    contentType: mimeType,
  });

  const media = {
    media_id: mediaId,
    mediaUrl,
    s3Key,
    fileName: req.file.originalname,
    mimeType,
    fileSize: req.file.size,
    isImageOrVideo: mediaType,
    createdAt: new Date().toISOString(),
  };

  await galleryRepository.createGalleryMedia(media);
  res.status(201).json(normalizeMedia(media));
}

async function updateGalleryMedia(req, res) {
  const mediaId = req.params.id;
  const existing = await galleryRepository.findByMediaId(mediaId);
  if (!existing) {
    throw new AppError(404, 'Media not found');
  }

  let mediaUrl = existing.mediaUrl;
  let s3Key = existing.s3Key;
  let fileName = existing.fileName;
  let mimeType = existing.mimeType;
  let fileSize = existing.fileSize;
  let mediaType = existing.isImageOrVideo;

  if (req.file) {
    const uploadedMimeType = validateUploadedFile(req.file);
    mediaType = resolveMediaType(req.body, uploadedMimeType);
    const nextS3Key = s3Service.buildGalleryKey(mediaId, req.file.originalname);
    mediaUrl = await s3Service.uploadFile({
      key: nextS3Key,
      body: req.file.buffer,
      contentType: uploadedMimeType,
    });

    if (existing.s3Key) {
      try {
        await s3Service.deleteFile(existing.s3Key);
      } catch (error) {
        console.error('Failed to delete previous gallery media from S3:', error);
      }
    }

    s3Key = nextS3Key;
    fileName = req.file.originalname;
    mimeType = uploadedMimeType;
    fileSize = req.file.size;
  } else {
    const rawType = String(req.body?.type ?? req.body?.isImageOrVideo ?? '').toLowerCase();
    if (rawType === 'video' || rawType === 'image') {
      mediaType = rawType;
    }
  }

  const updated = {
    ...existing,
    mediaUrl,
    s3Key,
    fileName,
    mimeType,
    fileSize,
    isImageOrVideo: mediaType === 'video' ? 'video' : 'image',
    updatedAt: new Date().toISOString(),
  };

  await galleryRepository.updateGalleryMedia(updated);
  res.json(normalizeMedia(updated));
}

async function deleteGalleryMedia(req, res) {
  const mediaId = req.params.id;
  const existing = await galleryRepository.findByMediaId(mediaId);
  if (!existing) {
    throw new AppError(404, 'Media not found');
  }

  if (existing.s3Key) {
    try {
      await s3Service.deleteFile(existing.s3Key);
    } catch (error) {
      console.error('Failed to delete gallery media from S3:', error);
    }
  }

  await galleryRepository.deleteGalleryMedia(mediaId);
  res.json({ message: 'Media deleted' });
}

function normalizeReview(item) {
  const candidate = item || {};
  return {
    id: String(candidate.review_id ?? candidate.id ?? ''),
    customerName: String(candidate.customerName ?? candidate.customer_name ?? candidate.name ?? ''),
    review: String(candidate.review ?? candidate.feedback ?? candidate.testimonial ?? ''),
    rating: candidate.rating === undefined ? undefined : Number(candidate.rating),
  };
}

async function listReviews(_req, res) {
  const reviews = await reviewRepository.listReviews();
  res.json(reviews.map(normalizeReview));
}

module.exports = {
  listGalleryMedia,
  getGalleryMediaById,
  createGalleryMedia,
  uploadGalleryMedia,
  updateGalleryMedia,
  deleteGalleryMedia,
  listReviews,
};
