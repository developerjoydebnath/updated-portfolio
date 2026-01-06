import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true,
  },
  ip: {
    type: String,
    required: false,
  },
  userAgent: {
    type: String,
    required: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const Analytics = mongoose.model('Analytics', analyticsSchema);
