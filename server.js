require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { errorHandler } = require('./middleware/errorHandler');
const validateUrl = require('./middleware/validateUrl');
const urlRoutes = require('./routes/urlRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware - FIRST
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting for shorten
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/shorten', limiter, validateUrl);

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString() }));

// API routes - BEFORE static - CRITICAL
app.use('/api', urlRoutes);

// 404 handler BEFORE static
app.use((req, res, next) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});

// Error handler - LAST middleware
app.use(errorHandler);

// Serve frontend - AFTER ALL API/404
app.use(express.static(path.join(__dirname, 'frontend')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/index.html'));
});

// Deploy-ready listen
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 URL Shortener on port ${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/health`);
  console.log(`📝 POST /api/shorten {"url": "https://example.com"}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  server.close(() => process.exit(0));
});
