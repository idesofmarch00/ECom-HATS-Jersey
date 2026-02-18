require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const { Product } = require('../model/Product');
const { getEmbedding } = require('../services/embedding');

async function migrate() {
  try {
    const mongoUrl = process.env.MONGODB_URL;
    if (!mongoUrl) {
      console.error('❌ MONGODB_URL is not defined in backend/.env!');
      process.exit(1);
    }

    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(mongoUrl);
    console.log('✅ Connected successfully!');

    const products = await Product.find({});
    console.log(`🛍️ Found ${products.length} products to migrate.`);

    let count = 0;
    for (let product of products) {
      console.log(`🔮 Generating embedding for product [${product.id}]: "${product.title}"...`);
      const textToEmbed = `${product.title} ${product.description} ${product.brand} ${product.category}`;
      
      try {
        product.embedding = await getEmbedding(textToEmbed);
        await product.save();
        count++;
        console.log(`✅ Embedding saved for product: "${product.title}"`);
      } catch (err) {
        console.error(`❌ Failed to embed product "${product.title}":`, err.message);
      }
    }

    console.log(`\n🎉 Migration completed! Generated embeddings for ${count}/${products.length} products.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed with internal error:', err);
    process.exit(1);
  }
}

migrate();
