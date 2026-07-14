const express = require('express');
const { health } = require('../controllers/healthController');

const healthRoutes = express.Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check
 *     tags: [Health]
 *     security: []
 *     responses:
 *       200:
 *         description: Service is healthy
 */
healthRoutes.get('/health', health);

module.exports = { healthRoutes };
