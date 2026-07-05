const express = require('express');
const catalogController = require('../controllers/catalogController');
const serviceController = require('../controllers/serviceController');
const offerController = require('../controllers/offerController');
const { asyncHandler } = require('../utils/asyncHandler');

const catalogRoutes = express.Router();

catalogRoutes.get('/services', asyncHandler(serviceController.listServices));
catalogRoutes.get('/services/:id', asyncHandler(serviceController.getServiceById));
catalogRoutes.post('/services', asyncHandler(serviceController.createService));

catalogRoutes.get('/offers', asyncHandler(offerController.listOffers));
catalogRoutes.get('/offers/:id', asyncHandler(offerController.getOfferById));

catalogRoutes.get('/gallery', asyncHandler(catalogController.listGalleryMedia));
catalogRoutes.get('/reviews', asyncHandler(catalogController.listReviews));
catalogRoutes.get('/feedbacks', asyncHandler(catalogController.listReviews));
catalogRoutes.get('/testimonials', asyncHandler(catalogController.listReviews));

module.exports = { catalogRoutes };
