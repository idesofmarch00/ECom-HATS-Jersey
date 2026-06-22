const { Product } = require('../model/Product');

exports.exportCatalog = async (req, res) => {
  try {
    const products = await Product.find({ deleted: false });

    const catalog = products.map((product) => ({
      id: product.id,
      title: product.title,
      brand: product.brand,
      category: product.category,
      price: product.price,
      discountPercentage: product.discountPercentage,
      discountPrice: product.discountPrice,
      stock: product.stock,
      rating: product.rating,
      thumbnail: product.thumbnail,
    }));

    res.setHeader('Content-Disposition', 'attachment; filename="catalog.json"');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(catalog);
  } catch (error) {
    res.status(500).json({ message: 'Error exporting catalog', error: error.message });
  }
};

exports.bulkUpdateStock = async (req, res) => {
  try {
    const { updates } = req.body;

    if (!updates || !Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ message: 'updates array is required and must not be empty' });
    }

    const operations = updates.map((item) => ({
      updateOne: {
        filter: { _id: item.productId },
        update: { $set: { stock: item.stock } },
      },
    }));

    const result = await Product.bulkWrite(operations);

    res.status(200).json({
      message: 'Bulk stock update complete',
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating stock', error: error.message });
  }
};
