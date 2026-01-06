import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: '' }, // Not used in UI input but present in types
  color: { type: String, default: 'blue' },
}, { timestamps: true });

export const Service = mongoose.model('Service', serviceSchema);
