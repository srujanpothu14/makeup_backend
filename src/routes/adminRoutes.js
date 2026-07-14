const express = require('express');
const catalogController = require('../controllers/catalogController');
const userController = require('../controllers/userController');
const serviceController = require('../controllers/serviceController');
const offerController = require('../controllers/offerController');
const bookingController = require('../controllers/bookingController');
const siteSettingsController = require('../controllers/businessDetailsController');
const { upload } = require('../middleware/uploadMiddleware');
const { asyncHandler } = require('../utils/asyncHandler');

const adminRoutes = express.Router();

/**
 * @openapi
 * /admin/users:
 *   get:
 *     summary: List users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User list
 */
adminRoutes.get('/admin/users', asyncHandler(userController.listUsers));
adminRoutes.get('/admin/users/:mobileNumber', asyncHandler(userController.getUserByMobileNumber));
adminRoutes.put('/admin/users/:mobileNumber', asyncHandler(userController.updateUser));
adminRoutes.delete('/admin/users/:mobileNumber', asyncHandler(userController.deleteUser));
adminRoutes.get('/admin/settings', asyncHandler(siteSettingsController.getBusinessDetails));
adminRoutes.put('/admin/settings', asyncHandler(siteSettingsController.updateBusinessDetails));

/**
 * @openapi
 * /admin/services:
 *   get:
 *     summary: List all services for admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All services including inactive ones
 */
adminRoutes.get('/admin/services', asyncHandler(serviceController.listServices));
adminRoutes.get('/admin/services/:id', asyncHandler(serviceController.getServiceById));
adminRoutes.post('/admin/services', asyncHandler(serviceController.createService));
adminRoutes.put('/admin/services/:id', asyncHandler(serviceController.updateService));
adminRoutes.patch('/admin/services/:id/visibility', asyncHandler(serviceController.toggleServiceVisibility));
adminRoutes.delete('/admin/services/:id', asyncHandler(serviceController.deleteService));

adminRoutes.get('/admin/offers', asyncHandler(offerController.listOffers));
adminRoutes.get('/admin/offers/:id', asyncHandler(offerController.getOfferById));
adminRoutes.post('/admin/offers', asyncHandler(offerController.createOffer));
adminRoutes.put('/admin/offers/:id', asyncHandler(offerController.updateOffer));
adminRoutes.delete('/admin/offers/:id', asyncHandler(offerController.deleteOffer));

adminRoutes.get('/admin/bookings', asyncHandler(bookingController.listBookings));
adminRoutes.patch('/admin/bookings/:id/status', asyncHandler(bookingController.updateBookingStatus));

adminRoutes.get('/admin/gallery', asyncHandler(catalogController.listGalleryMedia));
adminRoutes.get('/admin/gallery/:id', asyncHandler(catalogController.getGalleryMediaById));
adminRoutes.post('/admin/gallery', asyncHandler(catalogController.createGalleryMedia));
adminRoutes.post(
  '/admin/gallery/upload',
  upload.single('file'),
  asyncHandler(catalogController.uploadGalleryMedia),
);
adminRoutes.put(
  '/admin/gallery/:id',
  upload.single('file'),
  asyncHandler(catalogController.updateGalleryMedia),
);
adminRoutes.delete('/admin/gallery/:id', asyncHandler(catalogController.deleteGalleryMedia));

module.exports = { adminRoutes };
