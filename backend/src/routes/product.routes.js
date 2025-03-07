const express = require('express');
const { body } = require('express-validator');
const productController = require('../controllers/product.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// Validation middleware
const productValidation = [
  body('name').notEmpty().withMessage('Product name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category')
    .isIn(['vegetables', 'fruits', 'dairy', 'grains', 'other'])
    .withMessage('Invalid category'),
  body('event').notEmpty().withMessage('Event ID is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('unit')
    .isIn(['kg', 'g', 'piece', 'dozen', 'litre', 'ml'])
    .withMessage('Invalid unit'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('bulkPricing').optional().isArray().withMessage('Bulk pricing must be an array'),
  body('bulkPricing.*.quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  body('bulkPricing.*.price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('isOrganic').optional().isBoolean().withMessage('isOrganic must be a boolean'),
  body('harvestDate').optional().isISO8601().withMessage('Invalid harvest date'),
  body('expiryDate').optional().isISO8601().withMessage('Invalid expiry date')
];

// Public routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);

// Protected routes
router.use(protect);

// Farmer only routes
router.post(
  '/',
  authorize('farmer'),
  productValidation,
  productController.createProduct
);

router.put(
  '/:id',
  authorize('farmer'),
  productValidation,
  productController.updateProduct
);

router.delete(
  '/:id',
  authorize('farmer'),
  productController.deleteProduct
);

// Update stock (farmer only)
router.patch(
  '/:id/stock',
  authorize('farmer'),
  [
    body('stock')
      .isInt({ min: 0 })
      .withMessage('Stock must be a non-negative integer')
  ],
  productController.updateStock
);

// Update price (farmer only)
router.patch(
  '/:id/price',
  authorize('farmer'),
  [
    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    body('bulkPricing')
      .optional()
      .isArray()
      .withMessage('Bulk pricing must be an array'),
    body('bulkPricing.*.quantity')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Quantity must be a positive integer'),
    body('bulkPricing.*.price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number')
  ],
  productController.updatePrice
);

module.exports = router; 