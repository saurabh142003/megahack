const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateUserRole,
  updateLocation,
  getCurrentUser
} = require('../controllers/user.controller');

const router = express.Router();

// Validation middleware
const validateUserUpdate = [
  body('name').optional().trim().notEmpty().withMessage('Name is required'),
  body('phone').optional().trim().notEmpty().withMessage('Phone number is required'),
  body('location.coordinates').optional().isArray().withMessage('Location coordinates must be an array')
];

const validateLocationUpdate = [
  body('coordinates').isArray().withMessage('Coordinates must be an array')
];

// Public routes (require authentication)
router.get('/me', auth, getCurrentUser);

router.put('/me', auth, validateUserUpdate, updateUser);

// Location update route (require authentication)
router.put('/me/location', auth, validateLocationUpdate, updateLocation);

// Admin only routes
router.get('/', auth, authorize('community_admin'), getUsers);
router.get('/:id', auth, authorize('community_admin'), getUser);
router.put('/:id', auth, authorize('community_admin'), validateUserUpdate, updateUser);
router.delete('/:id', auth, authorize('community_admin'), deleteUser);
router.patch('/:id/role', auth, authorize('community_admin'), updateUserRole);

module.exports = router; 