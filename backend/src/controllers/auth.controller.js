const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Farmer = require('../models/farmer.model');
const Consumer = require('../models/consumer.model');
const CommunityAdmin = require('../models/communityAdmin.model');

// Register new user
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role, phone, location, farmDetails, preferences } = req.body;

    // Check if user already exists
    let user = await Farmer.findOne({ email }) || 
               await Consumer.findOne({ email }) || 
               await CommunityAdmin.findOne({ email });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user based on role
    switch (role) {
      case 'farmer':
        if (!farmDetails) {
          return res.status(400).json({ message: 'Farm details are required for farmers' });
        }
        user = new Farmer({
          name,
          email,
          password,
          role,
          phone,
          location,
          farmDetails
        });
        break;
      case 'consumer':
        user = new Consumer({
          name,
          email,
          password,
          role,
          phone,
          location,
          preferences: preferences || {}
        });
        break;
      case 'community_admin':
        // If community admin is also a farmer
        if (farmDetails) {
          user = new CommunityAdmin({
            name,
            email,
            password,
            role: 'farmer',
            phone,
            location,
            farmDetails,
            permissions: ['manage_markets', 'manage_events', 'manage_farmers', 'manage_consumers', 'view_analytics']
          });
        } else {
          user = new CommunityAdmin({
            name,
            email,
            password,
            role: 'community_admin',
            phone,
            location,
            permissions: ['manage_markets', 'manage_events', 'manage_farmers', 'manage_consumers', 'view_analytics']
          });
        }
        break;
      default:
        return res.status(400).json({ message: 'Invalid role' });
    }

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Prepare response based on user role
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    };

    // Add role-specific fields
    if (user.role === 'farmer') {
      userResponse.farmDetails = user.farmDetails;
      userResponse.status = user.status;
    } else if (user.role === 'consumer') {
      userResponse.preferences = user.preferences;
    } else if (user.role === 'community_admin') {
      userResponse.permissions = user.permissions;
      userResponse.assignedMarkets = user.assignedMarkets;
      userResponse.assignedEvents = user.assignedEvents;
      if (farmDetails) {
        userResponse.farmDetails = user.farmDetails;
      }
    }

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user in all collections
    let user = await Farmer.findOne({ email }) || 
               await Consumer.findOne({ email }) || 
               await CommunityAdmin.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Prepare response based on user role
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      location: user.location
    };

    // Add role-specific fields
    if (user.role === 'farmer') {
      userResponse.farmDetails = user.farmDetails;
      userResponse.status = user.status;
      userResponse.market = user.market;
      userResponse.stallDetails = user.stallDetails;
    } else if (user.role === 'consumer') {
      userResponse.preferences = user.preferences;
      userResponse.currentMarket = user.currentMarket;
      userResponse.currentEvent = user.currentEvent;
    } else if (user.role === 'community_admin') {
      userResponse.permissions = user.permissions;
      userResponse.assignedMarkets = user.assignedMarkets;
      userResponse.assignedEvents = user.assignedEvents;
      if (user.farmDetails) {
        userResponse.farmDetails = user.farmDetails;
      }
    }

    res.json({
      message: 'Login successful',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    let user;
    switch (req.user.role) {
      case 'farmer':
        user = await Farmer.findById(req.user.userId).select('-password');
        break;
      case 'consumer':
        user = await Consumer.findById(req.user.userId).select('-password');
        break;
      case 'community_admin':
        user = await CommunityAdmin.findById(req.user.userId).select('-password');
        break;
      default:
        return res.status(400).json({ message: 'Invalid role' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 