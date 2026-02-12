const { Product } = require('../model/Product');
const { getEmbedding } = require('../services/embedding');

exports.createProduct = async (req, res) => {
  const product = new Product(req.body);
  product.discountPrice = Math.round(product.price * (1 - product.discountPercentage / 100));
  
  // Auto-generate vector embedding from product content
  try {
    const textToEmbed = `${product.title} ${product.description} ${product.brand} ${product.category}`;
    product.embedding = await getEmbedding(textToEmbed);
  } catch (embedErr) {
    console.error('Failed to generate embedding during product creation:', embedErr);
  }

  try {
    const doc = await product.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchAllProducts = async (req, res) => {
  // filter = {"category":["smartphone","laptops"]}
  // sort = {_sort:"price",_order="desc"}
  // pagination = {_page:1,_limit=10}
  let condition = {};
  if (!req.query.admin) {
    condition.deleted = { $ne: true };
  }

  // --- ATLAS VECTOR SEARCH PATH ---
  if (req.query.semanticSearch) {
    console.log(`🔍 Processing semantic search: "${req.query.semanticSearch}"`);
    try {
      const queryVector = await getEmbedding(req.query.semanticSearch);

      const pipeline = [
        {
          $vectorSearch: {
            index: "vector_index",
            path: "embedding",
            queryVector: queryVector,
            numCandidates: 100,
            limit: 50
          }
        }
      ];

      // Add matches for status, category and brand filters
      const matchStage = {};
      if (!req.query.admin) {
        matchStage.deleted = { $ne: true };
      }
      if (req.query.category) {
        matchStage.category = { $in: req.query.category.split(',') };
      }
      if (req.query.brand) {
        matchStage.brand = { $in: req.query.brand.split(',') };
      }

      if (Object.keys(matchStage).length > 0) {
        pipeline.push({ $match: matchStage });
      }

      // Count total matches (before paging)
      const allMatches = await Product.aggregate(pipeline);
      const totalDocs = allMatches.length;

      // Apply pagination to aggregation pipeline
      if (req.query._page && req.query._limit) {
        const pageSize = parseInt(req.query._limit, 10);
        const page = parseInt(req.query._page, 10);
        pipeline.push({ $skip: pageSize * (page - 1) });
        pipeline.push({ $limit: pageSize });
      }

      const docs = await Product.aggregate(pipeline);
      res.set('X-Total-Count', totalDocs);
      return res.status(200).json(docs);

    } catch (vectorSearchErr) {
      console.warn("⚠️ Atlas Vector Search not active or failed. Gracefully falling back to regex search:", vectorSearchErr.message);
      
      // Fallback path: standard regex search over title and description
      const regex = new RegExp(req.query.semanticSearch, 'i');
      const fallbackCondition = {
        ...condition,
        $or: [
          { title: { $regex: regex } },
          { description: { $regex: regex } }
        ]
      };

      if (req.query.category) {
        fallbackCondition.category = { $in: req.query.category.split(',') };
      }
      if (req.query.brand) {
        fallbackCondition.brand = { $in: req.query.brand.split(',') };
      }

      let fallbackQuery = Product.find(fallbackCondition);
      let totalFallbackQuery = Product.find(fallbackCondition);

      if (req.query._sort && req.query._order) {
        fallbackQuery = fallbackQuery.sort({ [req.query._sort]: req.query._order });
      }

      const totalDocs = await totalFallbackQuery.count().exec();

      if (req.query._page && req.query._limit) {
        const pageSize = parseInt(req.query._limit, 10);
        const page = parseInt(req.query._page, 10);
        fallbackQuery = fallbackQuery.skip(pageSize * (page - 1)).limit(pageSize);
      }

      const docs = await fallbackQuery.exec();
      res.set('X-Total-Count', totalDocs);
      return res.status(200).json(docs);
    }
  }

  // --- STANDARD FILTER SEARCH PATH ---
  let query = Product.find(condition);
  let totalProductsQuery = Product.find(condition);

  if (req.query.category) {
    query = query.find({ category: { $in: req.query.category.split(',') } });
    totalProductsQuery = totalProductsQuery.find({
      category: { $in: req.query.category.split(',') },
    });
  }
  if (req.query.brand) {
    query = query.find({ brand: { $in: req.query.brand.split(',') } });
    totalProductsQuery = totalProductsQuery.find({ brand: { $in: req.query.brand.split(',') } });
  }
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  const totalDocs = await totalProductsQuery.count().exec();

  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const docs = await query.exec();
    res.set('X-Total-Count', totalDocs);
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
    product.discountPrice = Math.round(product.price * (1 - product.discountPercentage / 100));
    
    // Re-generate vector embedding if content was updated
    try {
      const textToEmbed = `${product.title} ${product.description} ${product.brand} ${product.category}`;
      product.embedding = await getEmbedding(textToEmbed);
    } catch (embedErr) {
      console.error('Failed to regenerate embedding during product update:', embedErr);
    }

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json(err);
  }
};



