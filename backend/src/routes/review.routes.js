const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const reviewController = require('../controllers/review.controller');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Validation rules
const reviewValidation = [
  body('entityType')
    .isIn(['market', 'farmer', 'product'])
    .withMessage('Invalid entity type'),
  body('entityId')
    .isMongoId()
    .withMessage('Invalid entity ID'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .trim()
    .notEmpty()
    .withMessage('Comment is required')
    .isLength({ max: 500 })
    .withMessage('Comment must not exceed 500 characters'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array')
];

const reportValidation = [
  body('reason')
    .isIn(['inappropriate', 'spam', 'fake', 'other'])
    .withMessage('Invalid report reason')
];

// Routes
// Create a new review
router.post('/',
  auth,
  reviewValidation,
  reviewController.createReview
);

// Get reviews for an entity
router.get('/:entityType/:entityId',
  reviewController.getEntityReviews
);

// Update a review
router.patch('/:id',
  auth,
  [
    body('rating')
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    body('comment')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Comment is required')
      .isLength({ max: 500 })
      .withMessage('Comment must not exceed 500 characters'),
    body('images')
      .optional()
      .isArray()
      .withMessage('Images must be an array')
  ],
  reviewController.updateReview
);

// Delete a review
router.delete('/:id',
  auth,
  reviewController.deleteReview
);

// Mark review as helpful
router.post('/:id/helpful',
  auth,
  reviewController.markHelpful
);

// Report a review
router.post('/:id/report',
  auth,
  reportValidation,
  reviewController.reportReview
);

module.exports = router; 