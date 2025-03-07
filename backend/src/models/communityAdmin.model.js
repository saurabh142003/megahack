const mongoose = require('mongoose');
const baseUserSchema = require('./baseUser.model');
const bcrypt = require('bcryptjs');

const communityAdminSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['community_admin', 'farmer'],
    default: 'community_admin'
  },
  // Community Admin specific fields
  assignedMarkets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Market'
  }],
  assignedEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  permissions: [{
    type: String,
    enum: ['manage_markets', 'manage_events', 'manage_farmers', 'manage_consumers', 'view_analytics']
  }],

  // Farmer specific fields
  farmDetails: {
    farmSize: {
      type: Number,
      min: 0
    },
    crops: [{
      name: {
        type: String
      },
      area: {
        type: Number,
        min: 0
      },
      season: {
        type: String,
        enum: ['summer', 'winter', 'monsoon', 'all_year']
      },
      organic: {
        type: Boolean,
        default: false
      }
    }],
    experience: {
      type: Number,
      min: 0
    },
    certifications: [{
      type: String,
      enum: ['organic_farming', 'sustainable_agriculture', 'gmp', 'iso']
    }]
  },
  documents: [{
    type: {
      type: String,
      enum: ['land_document', 'id_proof', 'organic_certificate']
    },
    url: {
      type: String
    },
    name: {
      type: String
    }
  }],
  market: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Market'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  stallDetails: {
    stallNumber: String,
    stallLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [0, 0]
      }
    }
  },
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  totalSales: {
    type: Number,
    default: 0
  },
  activeEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  sales: {
    daily: [{
      date: {
        type: Date,
        default: Date.now
      },
      amount: {
        type: Number,
        default: 0
      }
    }],
    weekly: [{
      weekStart: Date,
      amount: {
        type: Number,
        default: 0
      }
    }],
    monthly: [{
      monthStart: Date,
      amount: {
        type: Number,
        default: 0
      }
    }],
    total: {
      type: Number,
      default: 0
    }
  },
  activityLog: [{
    action: String,
    details: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
});

// Extend the baseUserSchema
communityAdminSchema.add(baseUserSchema);

// Add password hashing and comparison methods
communityAdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

communityAdminSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Indexes
communityAdminSchema.index({ location: '2dsphere' });
communityAdminSchema.index({ 'stallDetails.stallLocation': '2dsphere' });
communityAdminSchema.index({ status: 1 });
communityAdminSchema.index({ market: 1 });

// Pre-save middleware to update average rating
communityAdminSchema.pre('save', function(next) {
  if (this.ratings.length > 0) {
    this.averageRating = this.ratings.reduce((acc, curr) => acc + curr.rating, 0) / this.ratings.length;
  }
  next();
});

const CommunityAdmin = mongoose.model('CommunityAdmin', communityAdminSchema);

module.exports = CommunityAdmin; 