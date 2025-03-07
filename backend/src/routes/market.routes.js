const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const {
  createMarket,
  getMarkets,
  getMarket,
  updateMarket,
  updateMarketBusyness,
  deleteMarket,
  requestToJoinMarket,
  getJoinRequests,
  handleJoinRequest,
  getApprovedFarmers,
  updateFarmerStatus
} = require('../controllers/market.controller');

// Validation middleware
const marketValidation = [
  body('name').trim().notEmpty().withMessage('Market name is required'),
  body('description').trim().notEmpty().withMessage('Market description is required'),
  body('location.type').equals('Point').withMessage('Location type must be Point'),
  body('location.coordinates').isArray().withMessage('Coordinates must be an array'),
  body('location.coordinates').isLength(2).withMessage('Coordinates must be [longitude, latitude]'),
  body('address.street').trim().notEmpty().withMessage('Street address is required'),
  body('address.city').trim().notEmpty().withMessage('City is required'),
  body('address.state').trim().notEmpty().withMessage('State is required'),
  body('address.pincode').trim().notEmpty().withMessage('Pincode is required'),
  body('marketType').isIn(['single_day', 'recurring']).withMessage('Invalid market type'),
  body('date').optional().isISO8601().withMessage('Invalid date format'),
  body('schedule.days').optional().isArray().withMessage('Schedule days must be an array'),
  body('schedule.days.*').optional().isIn(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
    .withMessage('Invalid day in schedule'),
  body('schedule.startDate').optional().isISO8601().withMessage('Invalid start date format'),
  body('schedule.endDate').optional().isISO8601().withMessage('Invalid end date format'),
  body('operatingHours.start').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid start time format'),
  body('operatingHours.end').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid end time format'),
  body('capacity.totalStalls').isInt({ min: 1 }).withMessage('Total stalls must be at least 1'),
  body('capacity.availableStalls').isInt({ min: 0 }).withMessage('Available stalls cannot be negative'),
  body('facilities').isArray().withMessage('Facilities must be an array'),
  body('photos').optional().isArray().withMessage('Photos must be an array'),
  body('rules').optional().isArray().withMessage('Rules must be an array')
];

// Routes
router.post(
  '/',
  auth,
  authorize('community_admin'),
  marketValidation,
  createMarket
);

router.get(
  '/',
  auth,
  authorize('community_admin'),
  getMarkets
);

router.get(
  '/:marketId',
  auth,
  authorize('community_admin'),
  getMarket
);

router.patch(
  '/:marketId',
  auth,
  authorize('community_admin'),
  marketValidation,
  updateMarket
);

router.patch(
  '/:marketId/busyness',
  auth,
  authorize('community_admin'),
  [
    body('busyness').isIn(['low', 'medium', 'high']).withMessage('Invalid busyness level')
  ],
  updateMarketBusyness
);

router.delete(
  '/:marketId',
  auth,
  authorize('community_admin'),
  deleteMarket
);

// Farmer routes
router.post(
  '/:marketId/join-request',
  auth,
  authorize('farmer'),
  requestToJoinMarket
);

// Market join request routes (admin only)
router.get(
  '/:marketId/join-requests',
  auth,
  authorize('community_admin'),
  getJoinRequests
);

router.patch(
  '/:marketId/join-requests/:requestId',
  auth,
  authorize('community_admin'),
  [
    body('status').isIn(['approved', 'rejected']).withMessage('Invalid status'),
    body('notes').optional().isString().withMessage('Notes must be a string')
  ],
  handleJoinRequest
);

// Approved farmers routes (admin only)
router.get(
  '/:marketId/approved-farmers',
  auth,
  authorize('community_admin'),
  getApprovedFarmers
);

router.patch(
  '/:marketId/approved-farmers/:farmerId',
  auth,
  authorize('community_admin'),
  [
    body('status').isIn(['active', 'suspended']).withMessage('Invalid status')
  ],
  updateFarmerStatus
);

module.exports = router; 