const { Brand } = require('../model/Brand');
const { cacheGet, cacheSet, cacheDel } = require('../services/redis');

exports.fetchBrands = async (req, res) => {
  try {
    const cacheKey = 'brands:all';
    const cachedBrands = await cacheGet(cacheKey);
    if (cachedBrands) {
      return res.status(200).json(cachedBrands);
    }

    const brands = await Brand.find({}).exec();
    await cacheSet(cacheKey, brands, 3600); // Cache for 1 hour
    res.status(200).json(brands);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.createBrand = async (req, res) => {
  const brand = new Brand(req.body);
  try {
    const doc = await brand.save();
    await cacheDel('brands:all'); // Invalidate cache
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

