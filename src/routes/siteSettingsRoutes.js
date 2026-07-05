const express = require('express');
const businessDetailsController = require('../controllers/businessDetailsController');
const { asyncHandler } = require('../utils/asyncHandler');

const siteSettingsRoutes = express.Router();

siteSettingsRoutes.get('/settings/:id', asyncHandler(businessDetailsController.getBusinessDetailsById));
siteSettingsRoutes.get('/settings', asyncHandler(businessDetailsController.getBusinessDetails));
siteSettingsRoutes.put('/settings', asyncHandler(businessDetailsController.updateBusinessDetails));

module.exports = { siteSettingsRoutes };
