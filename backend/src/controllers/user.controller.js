const { validationResult } = require('express-validator');
const Farmer = require('../models/farmer.model');
const Consumer = require('../models/consumer.model');
const CommunityAdmin = require('../models/communityAdmin.model');

// Get all users (Community Admin only)
exports.getUsers = async (req, res) => {
  try {
    const farmers = await Farmer.find().select('-password');
    const consumers = await Consumer.find().select('-password');
    const admins = await CommunityAdmin.find().select('-password');

    res.json({
      farmers,
      consumers,
      admins
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single user (Community Admin only)
exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    let user;

    // Try to find user in each collection
    user = await Farmer.findById(id).select('-password') ||
           await Consumer.findById(id).select('-password') ||
           await CommunityAdmin.findById(id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
exports.updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, phone, location, farmDetails, preferences } = req.body;
    const userId = req.user.userId;
    const userRole = req.user.role;

    let user;
    switch (userRole) {
      case 'farmer':
        user = await Farmer.findById(userId);
        if (farmDetails) {
          user.farmDetails = { ...user.farmDetails, ...farmDetails };
        }
        break;
      case 'consumer':
        user = await Consumer.findById(userId);
        if (preferences) {
          user.preferences = { ...user.preferences, ...preferences };
        }
        break;
      case 'community_admin':
        user = await CommunityAdmin.findById(userId);
        break;
      default:
        return res.status(400).json({ message: 'Invalid role' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update common fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (location) user.location = location;

    await user.save();

    res.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user (Community Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    let user;

    // Try to find and delete user from each collection
    user = await Farmer.findByIdAndDelete(id) ||
           await Consumer.findByIdAndDelete(id) ||
           await CommunityAdmin.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user role (Community Admin only)
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['farmer', 'consumer', 'community_admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Find user in current collection
    let user = await Farmer.findById(id) ||
               await Consumer.findById(id) ||
               await CommunityAdmin.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If role is changing, move user to new collection
    if (user.role !== role) {
      const userData = user.toObject();
      delete userData._id;
      delete userData.__v;

      // Delete from current collection
      await user.remove();

      // Create in new collection
      switch (role) {
        case 'farmer':
          if (!userData.farmDetails) {
            return res.status(400).json({ message: 'Farm details are required for farmers' });
          }
          user = new Farmer(userData);
          break;
        case 'consumer':
          user = new Consumer(userData);
          break;
        case 'community_admin':
          user = new CommunityAdmin({
            ...userData,
            permissions: ['manage_markets', 'manage_events', 'manage_farmers', 'manage_consumers', 'view_analytics']
          });
          break;
      }

      await user.save();
    }

    res.json(user);
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user location
exports.updateLocation = async (req, res) => {
  try {
    const { coordinates } = req.body;
    const userId = req.user.userId;
    const userRole = req.user.role;

    let user;
    switch (userRole) {
      case 'farmer':
        user = await Farmer.findById(userId);
        break;
      case 'consumer':
        user = await Consumer.findById(userId);
        break;
      case 'community_admin':
        user = await CommunityAdmin.findById(userId);
        break;
      default:
        return res.status(400).json({ message: 'Invalid role' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.location.coordinates = coordinates;
    user.lastLocationUpdate = Date.now();
    await user.save();

    res.json(user);
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;

    let user;
    switch (userRole) {
      case 'farmer':
        user = await Farmer.findById(userId).select('-password');
        break;
      case 'consumer':
        user = await Consumer.findById(userId).select('-password');
        break;
      case 'community_admin':
        user = await CommunityAdmin.findById(userId).select('-password');
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