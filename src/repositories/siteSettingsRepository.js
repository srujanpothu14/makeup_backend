const fs = require('fs/promises');
const path = require('path');
const { AppError } = require('../utils/appError');

const settingsFilePath = path.join(__dirname, '../data/siteSettings.json');

async function readSettingsFile() {
  try {
    const raw = await fs.readFile(settingsFilePath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    throw new AppError(500, 'Unable to read site settings');
  }
}

async function writeSettingsFile(settings) {
  try {
    await fs.writeFile(settingsFilePath, JSON.stringify(settings, null, 2), 'utf8');
    return settings;
  } catch (error) {
    throw new AppError(500, 'Unable to save site settings');
  }
}

module.exports = {
  readSettingsFile,
  writeSettingsFile,
};
