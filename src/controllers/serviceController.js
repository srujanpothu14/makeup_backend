const crypto = require('crypto');
const serviceRepository = require('../repositories/serviceRepository');
const { AppError } = require('../utils/appError');

function normalizeService(item) {
  const candidate = item || {};
  return {
    id: String(candidate.id ?? candidate.service_id ?? ''),
    title: String(candidate.serviceName ?? candidate.title ?? ''),
    category: String(candidate.category ?? 'Other'),
    durationMin: Number(candidate.duration ?? candidate.durationMin ?? 0),
    price: Number(candidate.price ?? 0),
    description: String(candidate.description ?? ''),
    thumbnailUrl: String(candidate.imageUrl ?? candidate.thumbnailUrl ?? ''),
    artistId: String(candidate.artistId ?? candidate.artist_id ?? ''),
  };
}

async function listServices(_req, res) {
  const services = await serviceRepository.listServices();
  res.json(services.map(normalizeService));
}

async function getServiceById(req, res) {
  const service = await serviceRepository.findByServiceId(req.params.id);
  if (!service) {
    throw new AppError(404, 'Service not found');
  }
  res.json(normalizeService(service));
}

async function createService(req, res) {
  const { title, category, durationMin, price, description, thumbnailUrl, artistId } = req.body || {};

  if (!title || !category || !durationMin || !price) {
    throw new AppError(400, 'Missing required service fields');
  }

  const service = {
    service_id: `s${crypto.randomUUID()}`,
    title: String(title),
    category: String(category),
    durationMin: Number(durationMin),
    price: Number(price),
    description: description ? String(description) : undefined,
    thumbnailUrl: thumbnailUrl ? String(thumbnailUrl) : undefined,
    artistId: artistId ? String(artistId) : undefined,
  };

  await serviceRepository.createService(service);
  res.status(201).json(normalizeService(service));
}

async function updateService(req, res) {
  const serviceId = req.params.id;
  const body = req.body || {};
  const updates = {};

  if (body.title !== undefined) updates.title = String(body.title);
  if (body.category !== undefined) updates.category = String(body.category);
  if (body.durationMin !== undefined) updates.durationMin = Number(body.durationMin);
  if (body.price !== undefined) updates.price = Number(body.price);
  if (body.description !== undefined) updates.description = String(body.description);
  if (body.thumbnailUrl !== undefined) updates.thumbnailUrl = String(body.thumbnailUrl);
  if (body.artistId !== undefined) updates.artistId = String(body.artistId);

  if (Object.keys(updates).length === 0) {
    throw new AppError(400, 'No service fields provided for update');
  }

  const updated = await serviceRepository.updateService(serviceId, updates);
  if (!updated) {
    throw new AppError(404, 'Service not found');
  }
  res.json(normalizeService(updated));
}

async function deleteService(req, res) {
  await serviceRepository.deleteService(req.params.id);
  res.json({ message: 'Service deleted' });
}

module.exports = {
  listServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
