const VerificationRequest = require('../models/verificationRequest.model');
const Farmer = require('../models/farmer.model');
const CommunityAdmin = require('../models/communityAdmin.model');
const { validationResult } = require('express-validator');

// Submit verification request
exports.submitVerificationRequest = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { communityAdminId, documents, additionalNotes } = req.body;
    const farmerId = req.user.userId;

    // Check if farmer exists
    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    // Check if community admin exists
    const communityAdmin = await CommunityAdmin.findById(communityAdminId);
    if (!communityAdmin) {
      return res.status(404).json({ message: 'Community admin not found' });
    }

    // Check if request already exists
    const existingRequest = await VerificationRequest.findOne({
      farmer: farmerId,
      communityAdmin: communityAdminId,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'A pending verification request already exists' });
    }

    // Create farmer profile for verification
    const farmerProfile = {
      name: farmer.name,
      email: farmer.email,
      phone: farmer.phone,
      farmDetails: farmer.farmDetails,
      experience: farmer.experience,
      products: farmer.products
    };

    // Create new verification request
    const verificationRequest = new VerificationRequest({
      farmer: farmerId,
      communityAdmin: communityAdminId,
      farmerProfile,
      documents,
      additionalNotes
    });

    await verificationRequest.save();

    // Add notification to community admin
    communityAdmin.notifications.push({
      type: 'farmer',
      title: 'New Verification Request',
      message: `Farmer ${farmer.name} has submitted a verification request`,
      read: false
    });

    await communityAdmin.save();

    res.status(201).json({
      message: 'Verification request submitted successfully',
      verificationRequest
    });
  } catch (error) {
    console.error('Submit verification request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all verification requests for a community admin
exports.getVerificationRequests = async (req, res) => {
  try {
    const communityAdminId = req.user.userId;
    const { status } = req.query;

    let query = { communityAdmin: communityAdminId };
    if (status) {
      query.status = status;
    }

    const verificationRequests = await VerificationRequest.find(query)
      .populate('farmer', 'name email phone farmDetails')
      .sort({ createdAt: -1 });

    res.json(verificationRequests);
  } catch (error) {
    console.error('Get verification requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get verification requests for a farmer
exports.getFarmerVerificationRequests = async (req, res) => {
  try {
    const farmerId = req.user.userId;

    const verificationRequests = await VerificationRequest.find({
      farmer: farmerId
    })
    .populate('communityAdmin', 'name email phone')
    .sort({ createdAt: -1 });

    res.json(verificationRequests);
  } catch (error) {
    console.error('Get farmer verification requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update verification request status (Community Admin only)
exports.updateVerificationStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, rejectionReason } = req.body;
    const communityAdminId = req.user.userId;

    const verificationRequest = await VerificationRequest.findOne({
      _id: requestId,
      communityAdmin: communityAdminId
    });

    if (!verificationRequest) {
      return res.status(404).json({ message: 'Verification request not found' });
    }

    if (verificationRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Request has already been processed' });
    }

    verificationRequest.status = status;
    if (status === 'rejected' && rejectionReason) {
      verificationRequest.rejectionReason = rejectionReason;
    }

    await verificationRequest.save();

    // Update farmer's verification status if approved
    if (status === 'approved') {
      const farmer = await Farmer.findById(verificationRequest.farmer);
      if (farmer) {
        farmer.farmDetails.verificationStatus = 'verified';
        await farmer.save();
      }
    }

    // Add notification to farmer
    const farmer = await Farmer.findById(verificationRequest.farmer);
    if (farmer) {
      farmer.notifications.push({
        type: 'system',
        title: 'Verification Request Update',
        message: `Your verification request has been ${status}`,
        read: false
      });
      await farmer.save();
    }

    res.json({
      message: `Verification request ${status} successfully`,
      verificationRequest
    });
  } catch (error) {
    console.error('Update verification status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 