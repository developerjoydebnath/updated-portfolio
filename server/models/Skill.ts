import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  percentage: { type: Number, required: true },
  category: { type: String, enum: ['Frontend', 'Backend', 'Database', 'Tools', 'Styling'], required: true },
  icon: { type: String, default: '' },
}, { timestamps: true });

export const Skill = mongoose.model('Skill', skillSchema);
