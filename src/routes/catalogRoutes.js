const express = require('express');
const catalogController = require('../controllers/catalogController');
const serviceController = require('../controllers/serviceController');
const offerController = require('../controllers/offerController');
const { asyncHandler } = require('../utils/asyncHandler');

const catalogRoutes = express.Router();

/**
 * @openapi
 * /services:
 *   get:
 *     summary: List public services
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: List of visible services
 */
catalogRoutes.get('/services', asyncHandler(serviceController.listServices));

/**
 * @openapi
 * /services/{id}:
 *   get:
 *     summary: Get service by id
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service details
 */
catalogRoutes.get('/services/:id', asyncHandler(serviceController.getServiceById));

/**
 * @openapi
 * /offers:
 *   get:
 *     summary: List offers
 *     tags: [Offers]
 *     responses:
 *       200:
 *         description: List of offers
 */
catalogRoutes.get('/offers', asyncHandler(offerController.listOffers));
catalogRoutes.get('/offers/:id', asyncHandler(offerController.getOfferById));

/**
 * @openapi
 * /gallery:
 *   get:
 *     summary: Get gallery media
 *     tags: [Gallery]
 *     responses:
 *       200:
 *         description: List of gallery items
 */
catalogRoutes.get('/gallery', asyncHandler(catalogController.listGalleryMedia));

/**
 * @openapi
 * /reviews:
 *   get:
 *     summary: List customer reviews
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: List of reviews
 */
catalogRoutes.get('/reviews', asyncHandler(catalogController.listReviews));

module.exports = { catalogRoutes };