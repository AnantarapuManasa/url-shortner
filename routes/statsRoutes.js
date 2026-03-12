const express = require("express");
const router = express.Router();
const UrlModel = require("../models/Url");

router.get("/:shortCode", async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await UrlModel.findByShortCode(shortCode);

    if (!url) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    res.json({
      shortCode: shortCode,
      originalUrl: url.original_url,
      clicks: url.clicks,
      createdAt: url.created_at
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;