const UrlModel = require('../models/Url');
const cache = require('../services/redisService');
const { generateShortCode } = require('../utils/generateCode');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const shorten = async (req, res, next) => {
  try {
    const { url: originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ error: "URL is required" });
    }

    const shortCode = generateShortCode();

    await UrlModel.create({
      originalUrl,
      shortCode
    });

   // await cache.set(shortCode, originalUrl);

    res.status(201).json({
      shortUrl: `${BASE_URL}/api/${shortCode}`,
      shortCode
    });

  } catch (err) {
    next(err);
  }
};

const redirect = async (req, res, next) => {
  try {
    const { shortCode } = req.params;

    let originalUrl = null; // skip Redis for now

    if (!originalUrl) {
      const url = await UrlModel.findByShortCode(shortCode);

      if (!url) {
        return res.status(404).json({ error: "URL not found" });
      }

      originalUrl = url.original_url;
     // await cache.set(shortCode, originalUrl);
    }

    await UrlModel.incrementClicks(shortCode);

    res.redirect(originalUrl);

  } catch (err) {
    next(err);
  }
};

module.exports = {
  shorten,
  redirect
};