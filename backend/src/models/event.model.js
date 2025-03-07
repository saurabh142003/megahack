const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  market: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Market',
    required: true
  },
  communityAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommunityAdmin',
    required: true
  },
  eventType: {
    type: String,
    enum: ['single_day', 'multi_day'],
    required: true
  },
  // For single-day events
  date: {
    type: Date
  },
  // For multi-day events
  schedule: {
    startDate: Date,
    endDate: Date,
    days: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }]
  },
  time: {
    start: String,
    end: String
  },
  category: {
    type: String,
    enum: ['organic_fair', 'farmer_training', 'product_showcase', 'community_gathering', 'other'],
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  participants: {
    farmers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farmer'
    }],
    consumers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Consumer'
    }],
    maxParticipants: Number
  },
  activities: [{
    title: String,
    description: String,
    startTime: String,
    endTime: String,
    speaker: String,
    location: String
  }],
  requirements: [{
    type: String,
    trim: true
  }],
  facilities: [{
    type: String,
    enum: ['parking', 'restrooms', 'shelter', 'electricity', 'water', 'wifi', 'first_aid']
  }],
  photos: [{
    url: String,
    caption: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
eventSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event; 