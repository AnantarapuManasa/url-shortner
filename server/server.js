require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const urlRoutes = require("../routes/urlRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: "Too many requests. Please try again later." }
});

app.use(limiter);

// API routes
app.use("/api", urlRoutes);

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../frontend")));

// Homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Redirect short URL
app.get("/:code", (req, res) => {
  res.redirect(`/api/${req.params.code}`);
});

// Start server
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
