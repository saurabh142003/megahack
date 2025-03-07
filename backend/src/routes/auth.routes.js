const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Validation middleware
const registerValidation = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('name').notEmpty().withMessage('Name is required'),
  body('role')
    .isIn(['consumer', 'farmer', 'community_admin'])
    .withMessage('Invalid role'),
  body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
  body('location.coordinates')
    .isArray()
    .withMessage('Location coordinates must be an array')
    .custom((value) => {
      if (value.length !== 2) {
        throw new Error('Location must have exactly 2 coordinates');
      }
      return true;
    }),
  body('farmDetails').custom((value, { req }) => {
    if (req.body.role === 'farmer' && !value) {
      throw new Error('Farm details are required for farmers');
    }
    return true;
  }),
  body('farmDetails.farmSize').optional().isFloat({ min: 0 }).withMessage('Farm size must be a positive number'),
  body('farmDetails.crops').optional().isArray().withMessage('Crops must be an array'),
  body('farmDetails.crops.*.name').optional().notEmpty().withMessage('Crop name is required'),
  body('farmDetails.crops.*.area').optional().isFloat({ min: 0 }).withMessage('Crop area must be a positive number'),
  body('farmDetails.crops.*.season').optional().isIn(['summer', 'winter', 'monsoon', 'all_year']).withMessage('Invalid season'),
  body('farmDetails.experience').optional().isInt({ min: 0 }).withMessage('Experience must be a positive number'),
  body('farmDetails.certifications').optional().isArray().withMessage('Certifications must be an array'),
  body('farmDetails.certifications.*').optional().isIn(['organic_farming', 'sustainable_agriculture', 'gmp', 'iso']).withMessage('Invalid certification'),
  body('documents').optional().isArray().withMessage('Documents must be an array'),
  body('documents.*.type').optional().isIn(['land_document', 'id_proof', 'organic_certificate']).withMessage('Invalid document type'),
  body('documents.*.url').optional().isURL().withMessage('Invalid document URL'),
  body('documents.*.name').optional().notEmpty().withMessage('Document name is required'),
  body('preferences').optional().isObject().withMessage('Preferences must be an object'),
  body('preferences.favoriteCategories').optional().isArray().withMessage('Favorite categories must be an array'),
  body('preferences.favoriteCategories.*').optional().isIn(['vegetables', 'fruits', 'dairy', 'grains', 'other']).withMessage('Invalid category'),
  body('preferences.preferredPaymentMethods').optional().isArray().withMessage('Preferred payment methods must be an array'),
  body('preferences.preferredPaymentMethods.*').optional().isIn(['cash', 'upi', 'card']).withMessage('Invalid payment method'),
  body('preferences.preferredShoppingTime').optional().isIn(['morning', 'afternoon', 'evening']).withMessage('Invalid shopping time')
];

const loginValidation = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Routes
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.get('/me', protect, authController.getCurrentUser);

module.exports = router; 