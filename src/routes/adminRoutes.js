const express = require('express');
const userController = require('../controllers/userController');
const serviceController = require('../controllers/serviceController');
const offerController = require('../controllers/offerController');
const siteSettingsController = require('../controllers/businessDetailsController');
const { asyncHandler } = require('../utils/asyncHandler');

const adminRoutes = express.Router();

adminRoutes.get('/admin/users', asyncHandler(userController.listUsers));
adminRoutes.get('/admin/users/:mobileNumber', asyncHandler(userController.getUserByMobileNumber));
adminRoutes.put('/admin/users/:mobileNumber', asyncHandler(userController.updateUser));
adminRoutes.delete('/admin/users/:mobileNumber', asyncHandler(userController.deleteUser));
adminRoutes.get('/admin/settings', asyncHandler(siteSettingsController.getBusinessDetails));
adminRoutes.put('/admin/settings', asyncHandler(siteSettingsController.updateBusinessDetails));

adminRoutes.get('/admin/services', asyncHandler(serviceController.listServices));
adminRoutes.get('/admin/services/:id', asyncHandler(serviceController.getServiceById));
adminRoutes.post('/admin/services', asyncHandler(serviceController.createService));
adminRoutes.put('/admin/services/:id', asyncHandler(serviceController.updateService));
adminRoutes.delete('/admin/services/:id', asyncHandler(serviceController.deleteService));

adminRoutes.get('/admin/offers', asyncHandler(offerController.listOffers));
adminRoutes.get('/admin/offers/:id', asyncHandler(offerController.getOfferById));
adminRoutes.post('/admin/offers', asyncHandler(offerController.createOffer));
adminRoutes.put('/admin/offers/:id', asyncHandler(offerController.updateOffer));
adminRoutes.delete('/admin/offers/:id', asyncHandler(offerController.deleteOffer));

module.exports = { adminRoutes };
