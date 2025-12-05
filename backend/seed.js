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

    const AVAILABLE_COLORS = [
      { name: 'White', class: 'bg-white', selectedClass: 'ring-gray-400', id: 'white' },
      { name: 'Gray', class: 'bg-gray-200', selectedClass: 'ring-gray-400', id: 'gray' },
      { name: 'Black', class: 'bg-gray-900', selectedClass: 'ring-gray-900', id: 'black' },
      { name: 'Navy', class: 'bg-blue-900', selectedClass: 'ring-blue-900', id: 'navy' },
      { name: 'Red', class: 'bg-red-600', selectedClass: 'ring-red-600', id: 'red' },
      { name: 'Blue', class: 'bg-blue-600', selectedClass: 'ring-blue-600', id: 'blue' }
    ];

    const AVAILABLE_SIZES = [
      { name: 'XXS', inStock: true, id: 'xxs' },
      { name: 'XS', inStock: true, id: 'xs' },
      { name: 'S', inStock: true, id: 's' },
      { name: 'M', inStock: true, id: 'm' },
      { name: 'L', inStock: true, id: 'l' },
      { name: 'XL', inStock: true, id: 'xl' },
      { name: '2XL', inStock: true, id: '2xl' },
      { name: '3XL', inStock: true, id: '3xl' },
      { name: 'One Size', inStock: true, id: 'onesize' }
    ];

    function mapColors(colorNames) {
      if (!colorNames || !Array.isArray(colorNames)) return [];
      return colorNames.map(name => {
        const lowercase = name.toLowerCase().split('/')[0].trim();
        const found = AVAILABLE_COLORS.find(c => c.id === lowercase || c.name.toLowerCase() === lowercase);
        return found || { name, class: 'bg-gray-500', selectedClass: 'ring-gray-500', id: lowercase };
      });
    }

    function mapSizes(sizeNames) {
      if (!sizeNames || !Array.isArray(sizeNames)) return [];
      return sizeNames.map(name => {
        const lowercase = name.toLowerCase().replace(/\s+/g, '');
        const found = AVAILABLE_SIZES.find(s => s.id === lowercase || s.name.toLowerCase() === lowercase);
        return found || { name, inStock: true, id: lowercase };
      });
    }

    // Seed products — calculate discountPrice for each
    const products = data.products.map((p) => {
      const { id, sizes, colors, ...rest } = p;
      return {
        ...rest,
        // Store sizes and colors as schema expects (Schema.Types.Mixed)
        sizes: mapSizes(sizes),
        colors: mapColors(colors),
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
