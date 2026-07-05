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
    isActive: candidate.isActive === true || candidate.is_active === true || candidate.isActive === 'true' || candidate.is_active === 'true',
  };
}

async function listServices(req, res) {
  const services = await serviceRepository.listServices();
  const isAdminRoute = String(req.path || '').startsWith('/admin');
  const visibleServices = isAdminRoute
    ? services.map(normalizeService)
    : services.filter((service) => service.isActive !== false).map(normalizeService);
  res.json(visibleServices);
}

async function getServiceById(req, res) {
  const service = await serviceRepository.findByServiceId(req.params.id);
  if (!service) {
    throw new AppError(404, 'Service not found');
  }
  res.json(normalizeService(service));
}

async function createService(req, res) {
  const { title, category, durationMin, price, description, thumbnailUrl, artistId, isActive } = req.body || {};

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
    isActive: isActive === undefined ? true : Boolean(isActive),
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
  if (body.isActive !== undefined) updates.isActive = Boolean(body.isActive);

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

async function toggleServiceVisibility(req, res) {
  const serviceId = req.params.id;
  const body = req.body || {};
  const isActive = body.isActive !== undefined ? Boolean(body.isActive) : undefined;

  if (isActive === undefined) {
    throw new AppError(400, 'isActive is required');
  }

  const updated = await serviceRepository.updateService(serviceId, { isActive });
  if (!updated) {
    throw new AppError(404, 'Service not found');
  }

  res.json(normalizeService(updated));
}

module.exports = {
  listServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  toggleServiceVisibility,
};
