require('dotenv').config();

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const urlRoutes = require('../routes/urlRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: {
error: "Too many requests. Please try again later."
}
});

app.use(limiter);

// Routes
app.use('/api', urlRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('URL Shortener API Running');
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});