require('dotenv').config();
const mongoose = require('mongoose');
const { Product } = require('./model/Product');
const { Brand } = require('./model/Brand');
const { Category } = require('./model/Category');
const data = require('./data.json');

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await Brand.deleteMany({});
    await Category.deleteMany({});
    console.log('🗑️  Cleared existing products, brands, and categories');

    // Seed categories
    const categories = await Category.insertMany(data.categories);
    console.log(`📁 Seeded ${categories.length} categories`);

    // Seed brands
    const brands = await Brand.insertMany(data.brands);
    console.log(`🏷️  Seeded ${brands.length} brands`);

    // Seed products — calculate discountPrice for each
    const products = data.products.map((p) => {
      const { id, sizes, colors, ...rest } = p;
      return {
        ...rest,
        // Store sizes and colors as schema expects (Schema.Types.Mixed)
        sizes: sizes || [],
        colors: colors || [],
        discountPrice: Math.round(p.price * (1 - p.discountPercentage / 100)),
      };
    });

    const insertedProducts = await Product.insertMany(products);
    console.log(`🛍️  Seeded ${insertedProducts.length} products`);

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seedDB();
