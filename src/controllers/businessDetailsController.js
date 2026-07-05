const businessDetailsRepository = require('../repositories/businessDetailsRepository');
const { AppError } = require('../utils/appError');

function normalizeDetails(item) {
  const candidate = item || {};
  return {
    name: String(candidate.name ?? ''),
    business_name: String(candidate.business_name ?? candidate.name ?? ''),
    studio: String(candidate.studio ?? ''),
    designation: String(candidate.designation ?? ''),
    location: String(candidate.location ?? ''),
    locationUrl: String(candidate.locationUrl ?? ''),
    phone: String(candidate.phone ?? ''),
    contact_number: String(candidate.contact_number ?? candidate.phone ?? ''),
    instagram: String(candidate.instagram ?? candidate.instagram_url ?? ''),
    instagram_url: String(candidate.instagram_url ?? candidate.instagram ?? ''),
    whatsapp: String(candidate.whatsapp ?? ''),
    bio: String(candidate.bio ?? ''),
    facebook: String(candidate.facebook ?? candidate.facebook_url ?? ''),
    facebook_url: String(candidate.facebook_url ?? candidate.facebook ?? ''),
    photo: String(candidate.photo ?? ''),
  };
}

async function getBusinessDetails(_req, res) {
  const settings = await businessDetailsRepository.getBusinessDetails();
  if (!settings) {
    throw new AppError(404, 'Business details not found');
  }
  res.json(normalizeDetails(settings));
}

async function getBusinessDetailsById(req, res) {
  const businessId = req.params.id;
  const settings = await businessDetailsRepository.getBusinessDetailsById(businessId);
  if (!settings) {
    throw new AppError(404, `Business details not found for id ${businessId}`);
  }
  res.json(normalizeDetails(settings));
}

async function updateBusinessDetails(req, res) {
  const body = req.body || {};
  const settings = normalizeDetails(body);

  if (!settings.studio) {
    throw new AppError(400, 'Studio name is required');
  }

  const updated = await businessDetailsRepository.updateBusinessDetails(settings);
  res.json(normalizeDetails(updated));
}

module.exports = {
  getBusinessDetails,
  getBusinessDetailsById,
  updateBusinessDetails,
};
