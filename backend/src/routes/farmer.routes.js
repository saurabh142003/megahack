const express = require('express');
const { body } = require('express-validator');
const farmerController = require('../controllers/farmer.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// Basic registration validation
const basicRegistrationValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// Profile completion validation
const profileCompletionValidation = [
  body('phone').matches(/^[0-9]{10}$/).withMessage('Invalid phone number format'),
  body('location.type').equals('Point').withMessage('Location type must be Point'),
  body('location.coordinates').isArray().withMessage('Coordinates must be an array'),
  body('location.coordinates').isLength(2).withMessage('Coordinates must be [longitude, latitude]'),
  body('address.street').trim().notEmpty().withMessage('Street address is required'),
  body('address.city').trim().notEmpty().withMessage('City is required'),
  body('address.state').trim().notEmpty().withMessage('State is required'),
  body('address.pincode').trim().notEmpty().withMessage('Pincode is required'),
  body('farmDetails.farmSize').isFloat({ min: 0 }).withMessage('Farm size must be positive'),
  body('farmDetails.crops').isArray().withMessage('Crops must be an array'),
  body('farmDetails.crops.*.name').trim().notEmpty().withMessage('Crop name is required'),
  body('farmDetails.crops.*.area').isFloat({ min: 0 }).withMessage('Crop area must be positive'),
  body('farmDetails.crops.*.season').isIn(['summer', 'winter', 'monsoon', 'all_year']).withMessage('Invalid season'),
  body('farmDetails.experience').isInt({ min: 0 }).withMessage('Experience must be a positive number'),
  body('farmDetails.certifications').optional().isArray().withMessage('Certifications must be an array'),
  body('farmDetails.certifications.*').isIn(['organic_farming', 'sustainable_agriculture', 'gmp', 'iso']).withMessage('Invalid certification'),
  body('documents').isArray().withMessage('Documents must be an array'),
  body('documents.*.type').isIn(['land_document', 'id_proof', 'organic_certificate']).withMessage('Invalid document type'),
  body('documents.*.url').isURL().withMessage('Invalid document URL'),
  body('documents.*.name').trim().notEmpty().withMessage('Document name is required'),
  body('marketName').trim().notEmpty().withMessage('Market name is required')
];

// Profile update validation
const profileUpdateValidation = [
  body('phone').optional().matches(/^[0-9]{10}$/).withMessage('Invalid phone number format'),
  body('address.street').optional().trim().notEmpty().withMessage('Street address is required'),
  body('address.city').optional().trim().notEmpty().withMessage('City is required'),
  body('address.state').optional().trim().notEmpty().withMessage('State is required'),
  body('address.pincode').optional().trim().notEmpty().withMessage('Pincode is required'),
  body('farmDetails.farmSize').optional().isFloat({ min: 0 }).withMessage('Farm size must be positive'),
  body('farmDetails.crops').optional().isArray().withMessage('Crops must be an array'),
  body('farmDetails.crops.*.name').optional().trim().notEmpty().withMessage('Crop name is required'),
  body('farmDetails.crops.*.area').optional().isFloat({ min: 0 }).withMessage('Crop area must be positive'),
  body('farmDetails.crops.*.season').optional().isIn(['summer', 'winter', 'monsoon', 'all_year']).withMessage('Invalid season'),
  body('farmDetails.experience').optional().isInt({ min: 0 }).withMessage('Experience must be a positive number'),
  body('farmDetails.certifications').optional().isArray().withMessage('Certifications must be an array'),
  body('farmDetails.certifications.*').optional().isIn(['organic_farming', 'sustainable_agriculture', 'gmp', 'iso']).withMessage('Invalid certification'),
  body('documents').optional().isArray().withMessage('Documents must be an array'),
  body('documents.*.type').optional().isIn(['land_document', 'id_proof', 'organic_certificate']).withMessage('Invalid document type'),
  body('documents.*.url').optional().isURL().withMessage('Invalid document URL'),
  body('documents.*.name').optional().trim().notEmpty().withMessage('Document name is required')
];

// Application handling validation
const applicationValidation = [
  body('status').isIn(['approved', 'rejected']).withMessage('Invalid status'),
  body('notes').optional().isString().withMessage('Notes must be a string')
];

// Validation rules for event products
const eventProductsValidation = [
  body('eventId')
    .isMongoId()
    .withMessage('Invalid event ID'),
  body('products')
    .isArray()
    .withMessage('Products must be an array')
    .notEmpty()
    .withMessage('At least one product is required'),
  body('products.*.name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required'),
  body('products.*.price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('products.*.quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a positive integer'),
  body('products.*.unit')
    .isIn(['kg', 'g', 'pieces', 'dozen', 'bundle'])
    .withMessage('Invalid unit'),
  body('products.*.category')
    .isIn(['vegetables', 'fruits', 'grains', 'dairy', 'other'])
    .withMessage('Invalid category')
];

// Public routes
router.post(
  '/register',
  basicRegistrationValidation,
  farmerController.registerFarmer
);

// Protected routes
router.use(protect);

// Farmer routes
router.post(
  '/complete-profile',
  authorize('farmer'),
  profileCompletionValidation,
  farmerController.completeProfile
);

router.get(
  '/profile',
  authorize('farmer'),
  farmerController.getFarmerProfile
);

router.patch(
  '/profile',
  authorize('farmer'),
  profileUpdateValidation,
  farmerController.updateFarmerProfile
);

// Admin routes
router.get(
  '/pending-applications',
  authorize('community_admin'),
  farmerController.getPendingApplications
);

router.patch(
  '/:farmerId/application',
  authorize('community_admin'),
  applicationValidation,
  farmerController.handleFarmerApplication
);

// Event Products Routes
router.post('/event-products',
  eventProductsValidation,
  farmerController.addEventProducts
);

router.get('/event-products/:eventId',
  authorize('farmer'),
  farmerController.getCurrentEventProducts
);

router.get('/previous-event-products',
  authorize('farmer'),
  farmerController.getPreviousEventProducts
);

module.exports = router;