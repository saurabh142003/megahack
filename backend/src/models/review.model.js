const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  // The user who wrote the review
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // The type of entity being reviewed (market, farmer, or product)
  entityType: {
    type: String,
    enum: ['market', 'farmer', 'product'],
    required: true
  },
  // The ID of the entity being reviewed
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'entityType'
  },
  // Rating (1-5 stars)
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  // Review text
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  // Optional images
  images: [{
    type: String,
    trim: true
  }],
  // Whether the review is verified (e.g., verified purchase)
  isVerified: {
    type: Boolean,
    default: false
  },
  // Whether the review is helpful (for sorting)
  helpfulCount: {
    type: Number,
    default: 0
  },
  // Whether the review is reported
  isReported: {
    type: Boolean,
    default: false
  },
  // Report reason if reported
  reportReason: {
    type: String,
    enum: ['inappropriate', 'spam', 'fake', 'other'],
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient querying
reviewSchema.index({ entityType: 1, entityId: 1 });
reviewSchema.index({ user: 1, entityType: 1, entityId: 1 }, { unique: true });

// Virtual for average rating
reviewSchema.virtual('averageRating').get(function() {
  return this.rating;
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review; 