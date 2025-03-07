const mongoose = require('mongoose');

const verificationRequestSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true
  },
  communityAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommunityAdmin',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  // Farmer profile details
  farmerProfile: {
    name: String,
    email: String,
    phone: String,
    farmDetails: {
      farmName: String,
      farmLocation: {
        type: {
          type: String,
          enum: ['Point']
        },
        coordinates: [Number]
      },
      productCategories: [String],
      farmSize: Number,
      organicCertified: Boolean,
      farmDescription: String
    },
    experience: {
      years: Number,
      description: String
    },
    products: [{
      name: String,
      category: String,
      description: String,
      seasonality: String
    }]
  },
  documents: [{
    type: {
      type: String,
      enum: ['land_document', 'id_proof', 'organic_certificate', 'other'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  additionalNotes: {
    type: String,
    trim: true
  },
  rejectionReason: {
    type: String,
    trim: true
  },
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
verificationRequestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const VerificationRequest = mongoose.model('VerificationRequest', verificationRequestSchema);

module.exports = VerificationRequest; 