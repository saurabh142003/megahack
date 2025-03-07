const Event = require('../models/event.model');
const Market = require('../models/market.model');
const CommunityAdmin = require('../models/communityAdmin.model');
const Farmer = require('../models/farmer.model');
const { validationResult } = require('express-validator');

// Create new event
exports.createEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      description,
      market,
      eventType,
      date,
      schedule,
      time,
      category,
      participants
    } = req.body;

    const communityAdminId = req.user.userId;

    // Validate market exists and belongs to community admin
    const marketExists = await Market.findOne({
      _id: market,
      communityAdmin: communityAdminId
    });

    if (!marketExists) {
      return res.status(404).json({ message: 'Market not found or not authorized' });
    }

    // Validate event type specific fields
    if (eventType === 'single_day' && !date) {
      return res.status(400).json({ message: 'Date is required for single-day events' });
    }

    if (eventType === 'multi_day' && (!schedule || !schedule.startDate || !schedule.endDate || !schedule.days)) {
      return res.status(400).json({ 
        message: 'Schedule with startDate, endDate, and days is required for multi-day events' 
      });
    }

    // Create new event
    const event = new Event({
      name,
      description,
      market,
      communityAdmin: communityAdminId,
      eventType,
      date: eventType === 'single_day' ? date : undefined,
      schedule: eventType === 'multi_day' ? schedule : undefined,
      time,
      category,
      participants
    });

    await event.save();

    res.status(201).json({
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all events for a community admin
exports.getEvents = async (req, res) => {
  try {
    const communityAdminId = req.user.userId;
    const { 
      market,
      eventType,
      category,
      status,
      search,
      startDate,
      endDate
    } = req.query;

    let query = { communityAdmin: communityAdminId };

    // Add filters if provided
    if (market) {
      query.market = market;
    }
    if (eventType) {
      query.eventType = eventType;
    }
    if (category) {
      query.category = category;
    }
    if (status) {
      query.status = status;
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
      if (query.eventType === 'single_day') {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
      } else {
        query['schedule.startDate'] = {};
        if (startDate) query['schedule.startDate'].$gte = new Date(startDate);
        if (endDate) query['schedule.endDate'].$lte = new Date(endDate);
      }
    }

    const events = await Event.find(query)
      .populate('market', 'name location address')
      .populate('participants.farmers', 'name email phone')
      .populate('participants.consumers', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single event
exports.getEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const communityAdminId = req.user.userId;

    const event = await Event.findOne({
      _id: eventId,
      communityAdmin: communityAdminId
    })
    .populate('market', 'name location address')
    .populate('participants.farmers', 'name email phone')
    .populate('participants.consumers', 'name email phone');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { eventId } = req.params;
    const communityAdminId = req.user.userId;

    const event = await Event.findOne({
      _id: eventId,
      communityAdmin: communityAdminId
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Validate event type specific fields if being updated
    if (req.body.eventType) {
      if (req.body.eventType === 'single_day' && !req.body.date) {
        return res.status(400).json({ message: 'Date is required for single-day events' });
      }

      if (req.body.eventType === 'multi_day' && 
          (!req.body.schedule || !req.body.schedule.startDate || !req.body.schedule.endDate || !req.body.schedule.days)) {
        return res.status(400).json({ 
          message: 'Schedule with startDate, endDate, and days is required for multi-day events' 
        });
      }
    }

    // Update fields
    const updateFields = [
      'name',
      'description',
      'eventType',
      'date',
      'schedule',
      'time',
      'category',
      'participants',
      'status'
    ];

    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        event[field] = req.body[field];
      }
    });

    await event.save();

    res.json({
      message: 'Event updated successfully',
      event
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const communityAdminId = req.user.userId;

    const event = await Event.findOneAndDelete({
      _id: eventId,
      communityAdmin: communityAdminId
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update event status
exports.updateEventStatus = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { status } = req.body;
    const communityAdminId = req.user.userId;

    const event = await Event.findOne({
      _id: eventId,
      communityAdmin: communityAdminId
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.status = status;
    await event.save();

    res.json({
      message: 'Event status updated successfully',
      event
    });
  } catch (error) {
    console.error('Update event status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add farmer to event
exports.addFarmerToEvent = async (req, res) => {
  try {
    const { farmerId } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const market = await Market.findById(event.market);
    if (!market) {
      return res.status(404).json({
        success: false,
        message: 'Associated market not found'
      });
    }

    // Check if user is market admin
    if (market.admin.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add farmers to this event'
      });
    }

    // Check if farmer is already added
    if (event.participatingFarmers.includes(farmerId)) {
      return res.status(400).json({
        success: false,
        message: 'Farmer is already added to this event'
      });
    }

    event.participatingFarmers.push(farmerId);
    await event.save();

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Add farmer to event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding farmer to event'
    });
  }
};

// Complete event and archive products
exports.completeEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if event is already completed
    if (event.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Event is already completed'
      });
    }

    // Find all farmers participating in this event
    const farmers = await Farmer.find({
      'currentEventProducts.eventId': eventId
    });

    // Archive products for each farmer
    for (const farmer of farmers) {
      await farmer.archiveEventProducts(eventId);
    }

    // Update event status
    event.status = 'completed';
    event.completedAt = new Date();
    await event.save();

    res.json({
      success: true,
      message: 'Event completed and products archived successfully',
      data: event
    });
  } catch (error) {
    console.error('Complete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error completing event',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}; 