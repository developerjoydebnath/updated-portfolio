import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import swaggerUi from 'swagger-ui-express';
import analyticsRoutes from './routes/analytics';
import authRoutes from './routes/auth';
import contentRoutes from './routes/content';
import experienceRoutes from './routes/experience';
import projectRoutes from './routes/projects';
import queryRoutes from './routes/queries';
import serviceRoutes from './routes/services';
import skillRoutes from './routes/skills';
import testimonialRoutes from './routes/testimonials';
import { specs } from './swagger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps, Postman, server-to-server)
    if (!origin) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.warn(`Origin ${origin} not allowed by CORS`);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
  ],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400, // 24 hours - preflight cache duration
};


app.use((err: any, req: any, res: any, next: any) => {
  if (err instanceof multer.MulterError) {
    console.error('Multer Error:', err);
    return res.status(400).json({ error: err.message });
  }

  if (err) {
    console.error('Upload Error:', err);
    return res.status(500).json({ error: err.message });
  }

  next();
});


// Middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/queries', queryRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI is not defined in .env file');
  console.error('Please add MONGO_URI to your .env file');
  process.exit(1);
}

// MongoDB connection options
const mongooseOptions = {
  family: 4, // Use IPv4
  serverSelectionTimeoutMS: 10000, // 10 seconds timeout
  socketTimeoutMS: 45000, // 45 seconds socket timeout
  maxPoolSize: 10, // Maintain up to 10 socket connections
};

// Connect to MongoDB with error handling
async function connectToMongoDB() {
  try {
    await mongoose.connect(MONGO_URI || '', mongooseOptions);
    console.log('✅ Connected to MongoDB');
    
    // Start server only after successful DB connection
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📚 Swagger docs available at: http://localhost:${PORT}/api-docs`);
      console.log(`🏥 Health check at: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Exit the process with failure code
    process.exit(1);
  }
}

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected');
});

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected');
});

// Handle application shutdown gracefully
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
});

// Connect to MongoDB
connectToMongoDB();

export default app;