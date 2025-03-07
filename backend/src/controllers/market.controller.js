const Market = require('../models/market.model');
const CommunityAdmin = require('../models/communityAdmin.model');
const { validationResult } = require('express-validator');

// Create new market
exports.createMarket = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      description,
      location,
      address,
      marketType,
      date,
      schedule,
      operatingHours,
      facilities,
      capacity,
      photos,
      rules
    } = req.body;

    const communityAdminId = req.user.userId;

    // Validate market type specific fields
    if (marketType === 'single_day' && !date) {
      return res.status(400).json({ message: 'Date is required for single-day markets' });
    }

    if (marketType === 'recurring' && (!schedule || !schedule.days || !schedule.startDate || !schedule.endDate)) {
      return res.status(400).json({ 
        message: 'Schedule with days, startDate, and endDate is required for recurring markets' 
      });
    }

    // Create new market
    const market = new Market({
      name,
      description,
      location,
      address,
      marketType,
      date: marketType === 'single_day' ? date : undefined,
      schedule: marketType === 'recurring' ? schedule : undefined,
      operatingHours,
      facilities,
      capacity,
      photos,
      rules,
      communityAdmin: communityAdminId
    });

    await market.save();

    // Add market to community admin's assigned markets
    const communityAdmin = await CommunityAdmin.findById(communityAdminId);
    communityAdmin.assignedMarkets.push(market._id);
    await communityAdmin.save();

    res.status(201).json({
      message: 'Market created successfully',
      market
    });
  } catch (error) {
    console.error('Create market error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all markets for a community admin with search functionality
exports.getMarkets = async (req, res) => {
  try {
    const communityAdminId = req.user.userId;
    const { 
      marketType, 
      status, 
      search, 
      city,
      startDate,
      endDate
    } = req.query;

    let query = { communityAdmin: communityAdminId };

    // Add filters if provided
    if (marketType) {
      query.marketType = marketType;
    }
    if (status) {
      query.status = status;
    }
    if (city) {
      query['address.city'] = new RegExp(city, 'i');
    }

    // Search by name or description
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    // Date range filter
    if (startDate || endDate) {
      if (query.marketType === 'single_day') {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
      } else {
        query['schedule.startDate'] = {};
        if (startDate) query['schedule.startDate'].$gte = new Date(startDate);
        if (endDate) query['schedule.endDate'].$lte = new Date(endDate);
      }
    }

    const markets = await Market.find(query)
      .populate('communityAdmin', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(markets);
  } catch (error) {
    console.error('Get markets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single market
exports.getMarket = async (req, res) => {
  try {
    const { marketId } = req.params;
    const communityAdminId = req.user.userId;

    const market = await Market.findOne({
      _id: marketId,
      communityAdmin: communityAdminId
    }).populate('communityAdmin', 'name email phone');

    if (!market) {
      return res.status(404).json({ message: 'Market not found' });
    }

    res.json(market);
  } catch (error) {
    console.error('Get market error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update market
exports.updateMarket = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { marketId } = req.params;
    const communityAdminId = req.user.userId;

    const market = await Market.findOne({
      _id: marketId,
      communityAdmin: communityAdminId
    });

    if (!market) {
      return res.status(404).json({ message: 'Market not found' });
    }

    // Validate market type specific fields if being updated
    if (req.body.marketType) {
      if (req.body.marketType === 'single_day' && !req.body.date) {
        return res.status(400).json({ message: 'Date is required for single-day markets' });
      }

      if (req.body.marketType === 'recurring' && 
          (!req.body.schedule || !req.body.schedule.days || !req.body.schedule.startDate || !req.body.schedule.endDate)) {
        return res.status(400).json({ 
          message: 'Schedule with days, startDate, and endDate is required for recurring markets' 
        });
      }
    }

    // Update fields
    const updateFields = [
      'name',
      'description',
      'location',
      'address',
      'marketType',
      'date',
      'schedule',
      'operatingHours',
      'facilities',
      'capacity',
      'photos',
      'rules',
      'status'
    ];

    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        market[field] = req.body[field];
      }
    });

    await market.save();

    res.json({
      message: 'Market updated successfully',
      market
    });
  } catch (error) {
    console.error('Update market error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update market busyness
exports.updateMarketBusyness = async (req, res) => {
  try {
    const { marketId } = req.params;
    const { busyness } = req.body;
    const communityAdminId = req.user.userId;

    const market = await Market.findOne({
      _id: marketId,
      communityAdmin: communityAdminId
    });

    if (!market) {
      return res.status(404).json({ message: 'Market not found' });
    }

    market.busyness = busyness;
    await market.save();

    res.json({
      message: 'Market busyness updated successfully',
      market
    });
  } catch (error) {
    console.error('Update market busyness error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete market
exports.deleteMarket = async (req, res) => {
  try {
    const { marketId } = req.params;
    const communityAdminId = req.user.userId;

    const market = await Market.findOneAndDelete({
      _id: marketId,
      communityAdmin: communityAdminId
    });

    if (!market) {
      return res.status(404).json({ message: 'Market not found' });
    }

    // Remove market from community admin's assigned markets
    const communityAdmin = await CommunityAdmin.findById(communityAdminId);
    communityAdmin.assignedMarkets = communityAdmin.assignedMarkets.filter(
      id => id.toString() !== marketId
    );
    await communityAdmin.save();

    res.json({ message: 'Market deleted successfully' });
  } catch (error) {
    console.error('Delete market error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Request to join market
exports.requestToJoinMarket = async (req, res) => {
  try {
    const { marketId } = req.params;
    const farmerId = req.user.userId;

    const market = await Market.findById(marketId);
    if (!market) {
      return res.status(404).json({ message: 'Market not found' });
    }

    // Check if farmer already has a pending request
    const existingRequest = market.joinRequests.find(
      request => request.farmer.toString() === farmerId && request.status === 'pending'
    );
    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending request to join this market' });
    }

    // Check if farmer is already approved
    const isAlreadyApproved = market.approvedFarmers.some(
      approved => approved.farmer.toString() === farmerId
    );
    if (isAlreadyApproved) {
      return res.status(400).json({ message: 'You are already an approved farmer in this market' });
    }

    // Add join request
    market.joinRequests.push({
      farmer: farmerId,
      status: 'pending',
      requestDate: new Date()
    });

    await market.save();

    res.status(201).json({
      message: 'Join request submitted successfully',
      request: market.joinRequests[market.joinRequests.length - 1]
    });
  } catch (error) {
    console.error('Request to join market error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Handle join request (admin only)
exports.handleJoinRequest = async (req, res) => {
  try {
    const { marketId, requestId } = req.params;
    const { status, notes } = req.body;
    const communityAdminId = req.user.userId;

    const market = await Market.findOne({
      _id: marketId,
      communityAdmin: communityAdminId
    });

    if (!market) {
      return res.status(404).json({ message: 'Market not found or not authorized' });
    }

    const request = market.joinRequests.id(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Join request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'This request has already been processed' });
    }

    // Update request status
    request.status = status;
    request.responseDate = new Date();
    request.notes = notes;

    // If approved, add to approved farmers
    if (status === 'approved') {
      market.approvedFarmers.push({
        farmer: request.farmer,
        joinedDate: new Date(),
        status: 'active'
      });
    }

    await market.save();

    res.json({
      message: `Join request ${status} successfully`,
      request
    });
  } catch (error) {
    console.error('Handle join request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get market join requests (admin only)
exports.getJoinRequests = async (req, res) => {
  try {
    const { marketId } = req.params;
    const communityAdminId = req.user.userId;

    const market = await Market.findOne({
      _id: marketId,
      communityAdmin: communityAdminId
    }).populate('joinRequests.farmer', 'name email phone');

    if (!market) {
      return res.status(404).json({ message: 'Market not found or not authorized' });
    }

    res.json(market.joinRequests);
  } catch (error) {
    console.error('Get join requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get approved farmers (admin only)
exports.getApprovedFarmers = async (req, res) => {
  try {
    const { marketId } = req.params;
    const communityAdminId = req.user.userId;

    const market = await Market.findOne({
      _id: marketId,
      communityAdmin: communityAdminId
    }).populate('approvedFarmers.farmer', 'name email phone');

    if (!market) {
      return res.status(404).json({ message: 'Market not found or not authorized' });
    }

    res.json(market.approvedFarmers);
  } catch (error) {
    console.error('Get approved farmers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update farmer status in market (admin only)
exports.updateFarmerStatus = async (req, res) => {
  try {
    const { marketId, farmerId } = req.params;
    const { status } = req.body;
    const communityAdminId = req.user.userId;

    const market = await Market.findOne({
      _id: marketId,
      communityAdmin: communityAdminId
    });

    if (!market) {
      return res.status(404).json({ message: 'Market not found or not authorized' });
    }

    const approvedFarmer = market.approvedFarmers.find(
      approved => approved.farmer.toString() === farmerId
    );

    if (!approvedFarmer) {
      return res.status(404).json({ message: 'Farmer not found in approved farmers list' });
    }

    approvedFarmer.status = status;
    await market.save();

    res.json({
      message: 'Farmer status updated successfully',
      approvedFarmer
    });
  } catch (error) {
    console.error('Update farmer status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 