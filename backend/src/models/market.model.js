const mongoose = require('mongoose');

const marketSchema = new mongoose.Schema({
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
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  },
  communityAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommunityAdmin',
    required: true
  },
  marketType: {
    type: String,
    enum: ['single_day', 'recurring'],
    required: true
  },
  // For single-day markets
  date: {
    type: Date
  },
  // For recurring markets
  schedule: {
    days: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }],
    startDate: Date,
    endDate: Date
  },
  operatingHours: {
    start: String,
    end: String
  },
  facilities: [{
    type: String,
    enum: ['parking', 'restrooms', 'shelter', 'electricity', 'water', 'wifi']
  }],
  capacity: {
    totalStalls: Number,
    availableStalls: Number
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance', 'completed', 'cancelled'],
    default: 'active'
  },
  busyness: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  },
  photos: [{
    url: String,
    caption: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  rules: [{
    type: String,
    trim: true
  }],
  // New fields for farmer management
  joinRequests: [{
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farmer',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    requestDate: {
      type: Date,
      default: Date.now
    },
    responseDate: Date,
    notes: String
  }],
  approvedFarmers: [{
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farmer',
      required: true
    },
    joinedDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['active', 'suspended'],
      default: 'active'
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
marketSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for geospatial queries
marketSchema.index({ location: '2dsphere' });

const Market = mongoose.model('Market', marketSchema);

module.exports = Market; 