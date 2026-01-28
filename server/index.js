import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import authRoutes from './routes/auth.js';
import submissionRoutes from './routes/submissions.js';
import weekRoutes from './routes/weeks.js';
import adminRoutes from './routes/admin.js';
import activityRoutes from './routes/activity.js';

dotenv.config();

const app = express();

// Trust proxy (for rate limiting behind proxies)
// Set to true for Vercel and other proxy environments
app.set('trust proxy', true);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection - optimized for serverless
let cachedDb = null;

const connectDB = async () => {
  // Reuse existing connection if available (for serverless)
  if (cachedDb && mongoose.connection.readyState === 1) {
    console.log('Using existing MongoDB connection');
    return true;
  }

  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/athena-nexus';
    console.log('Connecting to MongoDB...');
    
    // Connection options optimized for serverless
    const options = {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    await mongoose.connect(mongoURI, options);
    cachedDb = mongoose.connection;
    console.log('✅ MongoDB Connected');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('Full error:', error);
    return false;
  }
};

// Ensure DB connection before handling requests (for serverless)
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/weeks', weekRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/activity', activityRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  await connectDB();
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    database: dbStatus
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Export handler for Vercel serverless functions
export default app;

// For local development - start server after MongoDB connection
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Only run in development or when not on Vercel
  if (process.env.VERCEL) {
    console.log('Running on Vercel - using serverless handler');
    return;
  }

  const dbConnected = await connectDB();
  
  if (!dbConnected) {
    console.error('Failed to connect to MongoDB. Server will not start.');
    console.error('Please check:');
    console.error('1. MongoDB is running (local) or connection string is correct (Atlas)');
    console.error('2. MONGODB_URI in .env file is correct');
    process.exit(1);
  }

  // Check for required environment variables
  if (!process.env.JWT_SECRET) {
    console.error('⚠️  WARNING: JWT_SECRET is not set!');
    console.error('Run: cd server && npm run generate-secret');
    console.error('Then add JWT_SECRET to your .env file');
  }

  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  });
};

// Only start server if not on Vercel
if (!process.env.VERCEL) {
  startServer();
}

