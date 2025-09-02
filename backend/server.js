import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import donationsRouter from './routes/donations.js';
import marketplaceRouter from './routes/marketplace.js';
import rewardsRouter from './routes/rewards.js';
import paystackRouter from './routes/paystack.js';
import aiRouter from './routes/ai.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/donations', donationsRouter);
app.use('/api/marketplace', marketplaceRouter);
app.use('/api/rewards', rewardsRouter);
app.use('/api/paystack', paystackRouter);
app.use('/api/ai', aiRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 HungerLink server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});

export default app;