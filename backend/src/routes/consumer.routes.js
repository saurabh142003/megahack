const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const consumerController = require('../controllers/consumer.controller');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Validation rules
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phone').optional().isMobilePhone().withMessage('Please enter a valid phone number')
];

// Routes
router.post('/register', registerValidation, consumerController.registerConsumer);

// Get nearby markets (within 5km)
router.get('/nearby-markets/:lat/:lng', consumerController.getNearbyMarkets);

// Update consumer preferences
router.patch('/preferences', 
  auth, 
  [
    body('preferences').isObject().withMessage('Preferences must be an object'),
    body('preferences.notificationRadius').optional().isNumeric().withMessage('Notification radius must be a number'),
    body('preferences.notificationTypes').optional().isArray().withMessage('Notification types must be an array')
  ],
  consumerController.updatePreferences
);

// Get consumer profile
router.get('/profile', auth, consumerController.getProfile);

module.exports = router; 