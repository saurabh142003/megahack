const Farmer = require('../models/farmer.model');
const Market = require('../models/market.model');
const Event = require('../models/event.model');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

// Basic farmer registration
exports.registerFarmer = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Check if farmer already exists
    const existingFarmer = await Farmer.findOne({ email });
    if (existingFarmer) {
      return res.status(400).json({ message: 'Farmer with this email already exists' });
    }

    // Create new farmer with basic details
    const farmer = new Farmer({
      name,
      email,
      password,
      role: 'farmer',
      status: 'incomplete',
      location: {
        type: 'Point',
        coordinates: [0, 0]  // Default coordinates
      }
    });

    await farmer.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: farmer._id, role: farmer.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.status(201).json({
      message: 'Farmer registered successfully. Please complete your profile.',
      farmer: {
        token: token,
        _id: farmer._id,
        name: farmer.name,
        email: farmer.email,
        status: farmer.status
      }
    });
  } catch (error) {
    console.error('Register farmer error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Complete farmer profile and apply for market
exports.completeProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      phone,
      location,
      address,
      farmDetails,
      documents,
      marketName
    } = req.body;

    const farmerId = req.user.userId;

    // Find farmer
    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    if (farmer.status !== 'incomplete') {
      return res.status(400).json({ message: 'Profile already completed' });
    }

    // Find market
    const market = await Market.findOne({ name: marketName });
    if (!market) {
      return res.status(404).json({ message: 'Market not found' });
    }

    // Update farmer profile
    farmer.phone = phone;
    farmer.location = location;
    farmer.address = address;
    farmer.farmDetails = farmDetails;
    farmer.documents = documents;
    farmer.market = market._id;
    farmer.communityAdmin = market.communityAdmin;
    farmer.status = 'pending';

    await farmer.save();

    res.json({
      message: 'Profile completed and market application submitted successfully',
      farmer: {
        _id: farmer._id,
        name: farmer.name,
        email: farmer.email,
        phone: farmer.phone,
        status: farmer.status,
        market: market.name
      }
    });
  } catch (error) {
    console.error('Complete profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get pending farmer applications for admin
exports.getPendingApplications = async (req, res) => {
  try {
    const pendingFarmers = await Farmer.find({ 
      status: 'pending',
      communityAdmin: req.user.userId 
    }).select('-password');

    res.json(pendingFarmers);
  } catch (error) {
    console.error('Get pending applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Approve or reject farmer application
exports.handleFarmerApplication = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const { status, notes } = req.body;

    const farmer = await Farmer.findOne({
      _id: farmerId,
      communityAdmin: req.user.userId,
      status: 'pending'
    });

    if (!farmer) {
      return res.status(404).json({ message: 'Farmer application not found' });
    }

    farmer.status = status;
    farmer.verificationNotes = notes;
    farmer.verifiedAt = new Date();
    farmer.verifiedBy = req.user.userId;

    await farmer.save();

    res.json({
      message: `Farmer application ${status} successfully`,
      farmer
    });
  } catch (error) {
    console.error('Handle farmer application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get farmer profile
exports.getFarmerProfile = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.user.userId)
      .select('-password')
      .populate('market', 'name location')
      .populate('communityAdmin', 'name email');

    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    res.json(farmer);
  } catch (error) {
    console.error('Get farmer profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update farmer profile
exports.updateFarmerProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const farmer = await Farmer.findById(req.user.userId);
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    // Update allowed fields
    const allowedUpdates = ['phone', 'address', 'farmDetails', 'documents'];
    allowedUpdates.forEach(field => {
      if (req.body[field]) {
        farmer[field] = req.body[field];
      }
    });

    await farmer.save();

    res.json({
      message: 'Profile updated successfully',
      farmer
    });
  } catch (error) {
    console.error('Update farmer profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add products to current event
exports.addEventProducts = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { eventId, products } = req.body;
    const farmerId = req.user.userId;

    // Find the farmer
    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    // Check if event exists and is active
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (event.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Event is not active'
      });
    }

    // Check if farmer is already participating in this event
    const existingEventProducts = farmer.currentEventProducts.find(
      event => event.eventId.toString() === eventId
    );

    if (existingEventProducts) {
      // Update existing products
      existingEventProducts.products = products;
    } else {
      // Add new event products
      farmer.currentEventProducts.push({
        eventId,
        products
      });
    }

    await farmer.save();

    res.status(201).json({
      success: true,
      message: 'Products added to event successfully',
      data: farmer.currentEventProducts.find(
        event => event.eventId.toString() === eventId
      )
    });
  } catch (error) {
    console.error('Add event products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding products to event',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get current event products
exports.getCurrentEventProducts = async (req, res) => {
  try {
    const { eventId } = req.params;
    const farmerId = req.user.userId;

    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    const eventProducts = farmer.currentEventProducts.find(
      event => event.eventId.toString() === eventId
    );

    if (!eventProducts) {
      return res.status(404).json({
        success: false,
        message: 'No products found for this event'
      });
    }

    res.json({
      success: true,
      data: eventProducts
    });
  } catch (error) {
    console.error('Get current event products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching event products',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get previous event products
exports.getPreviousEventProducts = async (req, res) => {
  try {
    const farmerId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;

    const farmer = await Farmer.findById(farmerId)
      .select('previousEventProducts')
      .populate('previousEventProducts.eventId', 'name date');

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    // Paginate previous event products
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedProducts = farmer.previousEventProducts.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        products: paginatedProducts,
        total: farmer.previousEventProducts.length,
        page: parseInt(page),
        totalPages: Math.ceil(farmer.previousEventProducts.length / limit)
      }
    });
  } catch (error) {
    console.error('Get previous event products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching previous event products',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}; 