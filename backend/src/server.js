import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { config } from './config/index.js';
import { initCronJobs } from './services/cronService.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import marketRoutes from './routes/marketRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

// Security & middleware
app.use(helmet({
  crossOriginResourcePolicy: false // Allow static image uploads cross-origin
}));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads serving
app.use('/uploads', express.static(config.uploadsDir));

// API route registrations
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/markets', marketRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'NEWS 24*7 Core API',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[API Error]:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: config.nodeEnv === 'development' ? err.message : undefined
  });
});

// Initialize server and background cron
app.listen(config.port, () => {
  console.log(`====================================================`);
  console.log(`  NEWS 24*7 API Server running on port ${config.port}`);
  console.log(`  Environment: ${config.nodeEnv}`);
  console.log(`  Endpoints: http://localhost:${config.port}/api/health`);
  console.log(`====================================================`);
  initCronJobs();
});
