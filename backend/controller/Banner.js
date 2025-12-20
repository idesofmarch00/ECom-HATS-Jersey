const { cacheGet, cacheSet, cacheDel } = require('../services/redis');

const BANNERS_KEY = 'banners:active';
const BANNER_TTL = 86400; // 24 hours default

// Get all active banners
exports.fetchBanners = async (req, res) => {
  try {
    const cached = await cacheGet(BANNERS_KEY);
    if (cached) {
      return res.status(200).json(cached);
    }
    // If Redis is empty/unavailable, return empty array
    res.status(200).json([]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch banners', error: err.message });
  }
};

// Create/update a banner (admin only)
exports.createBanner = async (req, res) => {
  try {
    const { text, bgColor, textColor, link, expiresInHours } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Banner text is required' });
    }

    // Get current banners
    let banners = (await cacheGet(BANNERS_KEY)) || [];

    const newBanner = {
      id: `banner_${Date.now()}`,
      text,
      bgColor: bgColor || '#4F46E5', // Indigo default
      textColor: textColor || '#FFFFFF',
      link: link || null,
      createdAt: new Date().toISOString(),
    };

    banners.push(newBanner);

    const ttl = expiresInHours ? expiresInHours * 3600 : BANNER_TTL;
    await cacheSet(BANNERS_KEY, banners, ttl);

    res.status(201).json(newBanner);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create banner', error: err.message });
  }
};

// Delete a banner by ID (admin only)
exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    let banners = (await cacheGet(BANNERS_KEY)) || [];

    const filtered = banners.filter((b) => b.id !== id);

    if (filtered.length === banners.length) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    await cacheSet(BANNERS_KEY, filtered, BANNER_TTL);
    res.status(200).json({ message: 'Banner deleted', id });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete banner', error: err.message });
  }
};
