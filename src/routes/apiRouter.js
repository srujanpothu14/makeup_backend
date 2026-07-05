const express = require('express');
const { healthRoutes } = require('./healthRoutes');
const { authRoutes } = require('./authRoutes');
const { catalogRoutes } = require('./catalogRoutes');
const { bookingRoutes } = require('./bookingRoutes');
const { adminRoutes } = require('./adminRoutes');
const { siteSettingsRoutes } = require('./siteSettingsRoutes');
const { authMiddleware } = require('../middleware/authMiddleware');

function createApiRouter() {
  const router = express.Router();

  router.use(authRoutes);
  router.use(authMiddleware);
  router.use(healthRoutes);
  router.use(catalogRoutes);
  router.use(bookingRoutes);
  router.use(siteSettingsRoutes);
  router.use(adminRoutes);

  return router;
}

module.exports = { createApiRouter };
