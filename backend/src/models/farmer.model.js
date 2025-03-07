const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const farmerSchema = new mongoose.Schema({
  // Basic User Fields
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['farmer'],
    default: 'farmer'
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]  // Default coordinates
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },

  // Farm Details
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
        default: true
      }
    }]
  },

  // Documents
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

  // Market Application
  market: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Market'
  },
  communityAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommunityAdmin'
  },
  status: {
    type: String,
    enum: ['incomplete', 'pending', 'approved', 'rejected'],
    default: 'incomplete'
  },
  verificationNotes: String,
  verifiedAt: Date,
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommunityAdmin'
  },

  // Stall Details (after approval)
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

  // Ratings and Reviews
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

  // Sales and Performance
  totalSales: {
    type: Number,
    default: 0
  },
  activeEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],

  // Products
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],

  // Sales Tracking
  sales: {
    daily: [{
      date: {
        type: Date,
        default: Date.now
      },
      amount: {
        type: Number,
        default: 0
      },
      products: [{
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product'
        },
        quantity: Number,
        price: Number
      }]
    }],
    weekly: [{
      weekStart: Date,
      amount: {
        type: Number,
        default: 0
      },
      products: [{
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product'
        },
        quantity: Number,
        price: Number
      }]
    }],
    monthly: [{
      monthStart: Date,
      amount: {
        type: Number,
        default: 0
      },
      products: [{
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product'
        },
        quantity: Number,
        price: Number
      }]
    }],
    total: {
      type: Number,
      default: 0
    }
  },

  // Current Event Products
  currentEventProducts: [{
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true
    },
    products: [{
      name: {
        type: String,
        required: true,
        trim: true
      },
      description: {
        type: String,
        trim: true
      },
      price: {
        type: Number,
        required: true,
        min: 0
      },
      quantity: {
        type: Number,
        required: true,
        min: 0
      },
      unit: {
        type: String,
        required: true,
        enum: ['kg', 'g', 'pieces', 'dozen', 'bundle']
      },
      category: {
        type: String,
        required: true,
        enum: ['vegetables', 'fruits', 'grains', 'dairy', 'other']
      },
      images: [{
        type: String,
        trim: true
      }],
      isOrganic: {
        type: Boolean,
        default: false
      },
      isAvailable: {
        type: Boolean,
        default: true
      }
    }]
  }],

  // Previous Event Products History
  previousEventProducts: [{
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true
    },
    eventName: {
      type: String,
      required: true
    },
    eventDate: {
      type: Date,
      required: true
    },
    products: [{
      name: {
        type: String,
        required: true,
        trim: true
      },
      description: {
        type: String,
        trim: true
      },
      price: {
        type: Number,
        required: true,
        min: 0
      },
      quantity: {
        type: Number,
        required: true,
        min: 0
      },
      unit: {
        type: String,
        required: true,
        enum: ['kg', 'g', 'pieces', 'dozen', 'bundle']
      },
      category: {
        type: String,
        required: true,
        enum: ['vegetables', 'fruits', 'grains', 'dairy', 'other']
      },
      images: [{
        type: String,
        trim: true
      }],
      isOrganic: {
        type: Boolean,
        default: false
      },
      isAvailable: {
        type: Boolean,
        default: true
      },
      soldQuantity: {
        type: Number,
        default: 0
      },
      totalRevenue: {
        type: Number,
        default: 0
      }
    }]
  }],

  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
farmerSchema.index({ location: '2dsphere' });
farmerSchema.index({ 'stallDetails.stallLocation': '2dsphere' });
farmerSchema.index({ status: 1 });
farmerSchema.index({ market: 1 });

// Hash password before saving
farmerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
farmerSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Pre-save middleware to update average rating
farmerSchema.pre('save', function(next) {
  if (this.ratings.length > 0) {
    this.averageRating = this.ratings.reduce((acc, curr) => acc + curr.rating, 0) / this.ratings.length;
  }
  next();
});

// Method to move current event products to previous event products
farmerSchema.methods.archiveEventProducts = async function(eventId) {
  const currentEvent = this.currentEventProducts.find(event => event.eventId.toString() === eventId.toString());
  
  if (currentEvent) {
    // Add to previous event products
    this.previousEventProducts.push({
      eventId: currentEvent.eventId,
      eventName: currentEvent.eventName,
      eventDate: currentEvent.eventDate,
      products: currentEvent.products
    });

    // Remove from current event products
    this.currentEventProducts = this.currentEventProducts.filter(
      event => event.eventId.toString() !== eventId.toString()
    );

    await this.save();
  }
};

const Farmer = mongoose.model('Farmer', farmerSchema);

module.exports = Farmer; 