const siteSettingsRepository = require('../repositories/siteSettingsRepository');
const { AppError } = require('../utils/appError');

function normalizeSettings(item) {
  const candidate = item || {};
  return {
    name: String(candidate.name ?? ''),
    studio: String(candidate.studio ?? ''),
    designation: String(candidate.designation ?? ''),
    location: String(candidate.location ?? ''),
    locationUrl: String(candidate.locationUrl ?? ''),
    phone: String(candidate.phone ?? ''),
    instagram: String(candidate.instagram ?? ''),
    whatsapp: String(candidate.whatsapp ?? ''),
    bio: String(candidate.bio ?? ''),
    facebook: String(candidate.facebook ?? ''),
    photo: String(candidate.photo ?? ''),
  };
}

async function getSettings(_req, res) {
  const settings = await siteSettingsRepository.readSettingsFile();
  res.json(normalizeSettings(settings));
}

async function updateSettings(req, res) {
  const body = req.body || {};
  const settings = normalizeSettings(body);

  if (!settings.studio) {
    throw new AppError(400, 'Studio name is required');
  }

  const updated = await siteSettingsRepository.writeSettingsFile(settings);
  res.json(normalizeSettings(updated));
}

module.exports = {
  getSettings,
  updateSettings,
};
