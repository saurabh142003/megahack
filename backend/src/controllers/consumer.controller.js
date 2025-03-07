const Consumer = require('../models/consumer.model');
const Market = require('../models/market.model');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register new consumer
exports.registerConsumer = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone } = req.body;

    // Check if consumer already exists
    const existingConsumer = await Consumer.findOne({ email });
    if (existingConsumer) {
      return res.status(400).json({ message: 'Consumer with this email already exists' });
    }

    // Create new consumer with only essential fields
    const consumer = new Consumer({
      name,
      email,
      password,
      phone,
      role: 'consumer'
    });

    await consumer.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: consumer._id, role: consumer.role },
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

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Consumer registered successfully',
      data: {
        consumer: {
          _id: consumer._id,
          name: consumer.name,
          email: consumer.email,
          phone: consumer.phone,
          role: consumer.role,
          createdAt: consumer.createdAt
        },
        token
      }
    });
  } catch (error) {
    console.error('Consumer registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error registering consumer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get nearby markets (within 5km)
exports.getNearbyMarkets = async (req, res) => {
  try {
    const { lat, lng } = req.params;
    
    // Validate coordinates
    if (!lat || !lng) {
      return res.status(400).json({ 
        success: false,
        message: 'Latitude and longitude are required' 
      });
    }

    // Convert to numbers and validate ranges
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid coordinates format' 
      });
    }

    if (latitude < -90 || latitude > 90) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid latitude. Must be between -90 and 90' 
      });
    }

    if (longitude < -180 || longitude > 180) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid longitude. Must be between -180 and 180' 
      });
    }

    // Find markets within 5km radius
    const markets = await Market.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: 5000 // 5km in meters
        }
      },
      status: 'active'
    }).populate('communityAdmin', 'name email');

    res.json({
      success: true,
      count: markets.length,
      data: {
        markets: markets.map(market => ({
          _id: market._id,
          name: market.name,
          description: market.description,
          location: market.location,
          address: market.address,
          marketType: market.marketType,
          operatingHours: market.operatingHours,
          facilities: market.facilities,
          communityAdmin: market.communityAdmin,
          distance: market.location.coordinates ? 
            calculateDistance([longitude, latitude], market.location.coordinates) : null
        }))
      }
    });
  } catch (error) {
    console.error('Get nearby markets error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching nearby markets',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update consumer preferences
exports.updatePreferences = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { preferences } = req.body;
    const consumerId = req.user.userId;

    const consumer = await Consumer.findById(consumerId);
    if (!consumer) {
      return res.status(404).json({ message: 'Consumer not found' });
    }

    consumer.preferences = { ...consumer.preferences, ...preferences };
    await consumer.save();

    res.json({
      message: 'Preferences updated successfully',
      preferences: consumer.preferences
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get consumer profile
exports.getProfile = async (req, res) => {
  try {
    const consumer = await Consumer.findById(req.user.userId)
      .select('-password')
      .populate('currentMarket', 'name location')
      .populate('currentEvent', 'name date');

    if (!consumer) {
      return res.status(404).json({ message: 'Consumer not found' });
    }

    res.json(consumer);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to calculate distance between two points
function calculateDistance(coord1, coord2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = coord1[1] * Math.PI/180;
  const φ2 = coord2[1] * Math.PI/180;
  const Δφ = (coord2[1]-coord1[1]) * Math.PI/180;
  const Δλ = (coord2[0]-coord1[0]) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
} 