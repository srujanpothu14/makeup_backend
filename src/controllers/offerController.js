const crypto = require('crypto');
const offerRepository = require('../repositories/offerRepository');
const { AppError } = require('../utils/appError');

function normalizeOffer(item) {
  const candidate = item || {};
  return {
    id: String(candidate.offer_id ?? candidate.id ?? ''),
    title: String(candidate.title ?? ''),
    description: String(candidate.description ?? ''),
    serviceId: String(candidate.serviceId ?? candidate.service_id ?? ''),
    discountPercent: Number(candidate.discountPercent ?? candidate.discount_percent ?? 0),
  };
}

async function listOffers(_req, res) {
  const offers = await offerRepository.listOffers();
  res.json(offers.map(normalizeOffer));
}

async function getOfferById(req, res) {
  const offer = await offerRepository.findByOfferId(req.params.id);
  if (!offer) {
    throw new AppError(404, 'Offer not found');
  }
  res.json(normalizeOffer(offer));
}

async function createOffer(req, res) {
  const { title, description, serviceId, discountPercent, offer_id } = req.body || {};

  if (!title || !serviceId || discountPercent === undefined) {
    throw new AppError(400, 'Missing required offer fields');
  }

  const offer = {
    offer_id: offer_id ? String(offer_id) : `o${crypto.randomUUID()}`,
    title: String(title),
    description: description ? String(description) : undefined,
    serviceId: String(serviceId),
    discountPercent: Number(discountPercent),
  };

  await offerRepository.createOffer(offer);
  res.status(201).json(normalizeOffer(offer));
}

async function updateOffer(req, res) {
  const offerId = req.params.id;
  const updates = {};
  const body = req.body || {};

  if (body.title !== undefined) updates.title = String(body.title);
  if (body.description !== undefined) updates.description = String(body.description);
  if (body.serviceId !== undefined) updates.serviceId = String(body.serviceId);
  if (body.discountPercent !== undefined) updates.discountPercent = Number(body.discountPercent);

  if (Object.keys(updates).length === 0) {
    throw new AppError(400, 'No offer fields provided for update');
  }

  const updated = await offerRepository.updateOffer(offerId, updates);
  if (!updated) {
    throw new AppError(404, 'Offer not found');
  }
  res.json(normalizeOffer(updated));
}

async function deleteOffer(req, res) {
  await offerRepository.deleteOffer(req.params.id);
  res.json({ message: 'Offer deleted' });
}

module.exports = {
  listOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
};
