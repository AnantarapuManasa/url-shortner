require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');

const urlRoutes = require('./routes/urlRoutes');
// const statsRoutes = require('./routes/statsRoutes');
const { errorHandler } = require('./middleware/errorHandler');
const validateUrl = require('./middleware/validateUrl');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP
  message: { error: 'Too many shorten requests, try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limit to shorten endpoint
app.use('/api/shorten', limiter, validateUrl);
// Health check
app.get('/health', (req, res) => res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() }));

// API Routes
app.use('/api', urlRoutes);
// app.use("/api/stats", statsRoutes);
// 404 handler (after all routes)
app.use((req, res, next) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});

// Global error handler (must be last)
app.use(errorHandler);

const server = app.listen(PORT, 'localhost', () => {
  console.log(`🚀 URL Shortener running on http://localhost:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/health`);
  console.log(`📝 Docs: POST /api/shorten { "url": "https://example.com" }`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => process.exit(0));
});

module.exports = server;

