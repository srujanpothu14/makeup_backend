const { mediaItems, reviews } = require('../data/staticData');
const { AppError } = require('../utils/appError');

function listServices(_req, res) {
  res.json([]);
}

function getServiceById(_req, res) {
  throw new AppError(404, 'Service not found');
}

function listGalleryMedia(_req, res) {
  res.json(mediaItems);
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
