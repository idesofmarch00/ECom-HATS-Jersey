const { Category } = require('../model/Category');
const { cacheGet, cacheSet, cacheDel } = require('../services/redis');

exports.fetchCategories = async (req, res) => {
  try {
    const cacheKey = 'categories:all';
    const cachedCategories = await cacheGet(cacheKey);
    if (cachedCategories) {
      return res.status(200).json(cachedCategories);
    }

    const categories = await Category.find({}).exec();
    await cacheSet(cacheKey, categories, 3600); // Cache for 1 hour
    res.status(200).json(categories);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.createCategory = async (req, res) => {
  const category = new Category(req.body);
  try {
    const doc = await category.save();
    await cacheDel('categories:all'); // Invalidate cache
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};




