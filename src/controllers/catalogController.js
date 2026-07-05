const { reviews } = require('../data/staticData');
const galleryRepository = require('../repositories/galleryRepository');
const { AppError } = require('../utils/appError');

function listServices(_req, res) {
  res.json([]);
}

function getServiceById(_req, res) {
  throw new AppError(404, 'Service not found');
}

async function listGalleryMedia(_req, res) {
  const media = await galleryRepository.listGalleryMedia();
  res.json(media);
}

function listReviews(_req, res) {
  res.json(reviews);
}

module.exports = {
  listServices,
  getServiceById,
  listGalleryMedia,
  listReviews,
};
