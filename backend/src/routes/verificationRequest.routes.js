const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const {
  submitVerificationRequest,
  getVerificationRequests,
  getFarmerVerificationRequests,
  updateVerificationStatus
} = require('../controllers/verificationRequest.controller');

// Validation middleware
const verificationRequestValidation = [
  body('communityAdminId').isMongoId().withMessage('Invalid community admin ID'),
  body('documents').isArray().withMessage('Documents must be an array'),
  body('documents.*.type').isIn(['land_document', 'id_proof', 'organic_certificate', 'other']).withMessage('Invalid document type'),
  body('documents.*.url').isURL().withMessage('Invalid document URL'),
  body('additionalNotes').optional().isString().trim()
];

// Routes
router.post(
  '/submit',
  protect,
  authorize('farmer'),
  verificationRequestValidation,
  submitVerificationRequest
);

router.get(
  '/admin/requests',
  protect,
  authorize('community_admin'),
  getVerificationRequests
);

router.get(
  '/farmer/requests',
  protect,
  authorize('farmer'),
  getFarmerVerificationRequests
);

router.patch(
  '/:requestId/status',
  protect,
  authorize('community_admin'),
  [
    body('status').isIn(['approved', 'rejected']).withMessage('Invalid status'),
    body('rejectionReason').optional().isString().trim()
  ],
  updateVerificationStatus
);

module.exports = router; 