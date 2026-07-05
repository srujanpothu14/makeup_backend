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
 * /services:
 *   post:
 *     summary: Create a service
 *     tags: [Services]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Service created
 */
catalogRoutes.post('/services', asyncHandler(serviceController.createService));

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

/**
 * @openapi
 * /offers/{id}:
 *   get:
 *     summary: Get offer by id
 *     tags: [Offers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Offer details
 */
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
 *     summary: Get reviews
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: List of reviews
 */
catalogRoutes.get('/reviews', asyncHandler(catalogController.listReviews));

/**
 * @openapi
 * /feedbacks:
 *   get:
 *     summary: Get feedbacks
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: List of feedback items
 */
catalogRoutes.get('/feedbacks', asyncHandler(catalogController.listReviews));

/**
 * @openapi
 * /testimonials:
 *   get:
 *     summary: Get testimonials
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: List of testimonials
 */
catalogRoutes.get('/testimonials', asyncHandler(catalogController.listReviews));

module.exports = { catalogRoutes };
