import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  duration: { type: String, required: true },
  points: [{ type: String }],
  type: { type: String, enum: ['experience', 'education'], required: true },
}, { timestamps: true });

export const Experience = mongoose.model('Experience', experienceSchema);
