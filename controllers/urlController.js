const { nanoid } = require("nanoid");

let urlDatabase = {}; // simple in-memory storage

// Create short URL
exports.createShortUrl = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const shortCode = nanoid(6);

    urlDatabase[shortCode] = url;

    const shortUrl = `${req.protocol}://${req.get("host")}/${shortCode}`;

    return res.json({
      shortUrl,
      shortCode
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Redirect to original URL
exports.redirectToOriginal = (req, res) => {
  const { code } = req.params;

  const originalUrl = urlDatabase[code];

  if (!originalUrl) {
    return res.status(404).json({ error: "URL not found" });
  }

  res.redirect(originalUrl);
};