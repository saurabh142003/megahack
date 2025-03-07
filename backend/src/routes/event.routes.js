const express = require('express');
const { body } = require('express-validator');
const eventController = require('../controllers/event.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// Validation middleware
const eventValidation = [
  body('name').trim().notEmpty().withMessage('Event name is required'),
  body('description').trim().notEmpty().withMessage('Event description is required'),
  body('market').isMongoId().withMessage('Invalid market ID'),
  body('eventType').isIn(['single_day', 'multi_day']).withMessage('Invalid event type'),
  body('date').optional().isISO8601().withMessage('Invalid date format'),
  body('schedule.startDate').optional().isISO8601().withMessage('Invalid start date format'),
  body('schedule.endDate').optional().isISO8601().withMessage('Invalid end date format'),
  body('schedule.days').optional().isArray().withMessage('Schedule days must be an array'),
  body('schedule.days.*').optional().isIn(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
    .withMessage('Invalid day in schedule'),
  body('time.start').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid start time format'),
  body('time.end').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid end time format'),
  body('category').isIn(['organic_fair', 'farmer_training', 'product_showcase', 'community_gathering', 'other'])
    .withMessage('Invalid event category'),
  body('participants.maxParticipants').optional().isInt({ min: 1 }).withMessage('Max participants must be at least 1')
];

// Public routes
router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEvent);

// Protected routes
router.use(protect);

// Admin only routes
router.post(
  '/',
  authorize('community_admin'),
  eventValidation,
  eventController.createEvent
);

router.put(
  '/:id',
  authorize('community_admin'),
  eventValidation,
  eventController.updateEvent
);

router.delete(
  '/:id',
  authorize('community_admin'),
  eventController.deleteEvent
);

// Update event status (admin only)
router.patch(
  '/:id/status',
  authorize('community_admin'),
  [
    body('status')
      .isIn(['scheduled', 'ongoing', 'completed', 'cancelled'])
      .withMessage('Invalid status')
  ],
  eventController.updateEventStatus
);

// Add farmer to event (admin only)
router.post(
  '/:id/farmers',
  authorize('community_admin'),
  [
    body('farmerId').notEmpty().withMessage('Farmer ID is required')
  ],
  eventController.addFarmerToEvent
);

// Complete event
router.post('/:id/complete',
  authorize('community_admin'),
  eventController.completeEvent
);

module.exports = router; 