const galleryRepository = require('../repositories/galleryRepository');
const reviewRepository = require('../repositories/reviewRepository');

async function listGalleryMedia(_req, res) {
  const media = await galleryRepository.listGalleryMedia();
  res.json(media);
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
  listReviews,
};
