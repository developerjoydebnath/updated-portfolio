import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  hero: {
    name: { type: String, default: '' },
    role: { type: String, default: '' },
    bio: { type: String, default: '' },
    profileImage: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
  },
  aboutMe: { type: String, default: '' },
  proficientIn: [{ type: String }],
  socialLinks: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    facebook: { type: String, default: '' },
  },
  contact: {
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
  },
  stats: [{
    _id: { type: String },
    label: { type: String },
    value: { type: String },
    icon: { type: String },
  }],
}, { timestamps: true });

export const Content = mongoose.model('Content', contentSchema);
