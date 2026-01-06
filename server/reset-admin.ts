import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from './models/User';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';

async function resetAdmin() {
  await mongoose.connect(MONGODB_URI);
  await User.deleteMany({});
  console.log('All users deleted');
  process.exit(0);
}

resetAdmin();
