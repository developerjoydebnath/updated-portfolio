import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  techStack: [{ type: String }],
  category: { type: String, enum: ['Full Stack', 'Frontend', 'UI/UX'], required: true },
  liveUrl: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  screenshots: [{ type: String }],
}, { timestamps: true });

export const Project = mongoose.model('Project', projectSchema);
