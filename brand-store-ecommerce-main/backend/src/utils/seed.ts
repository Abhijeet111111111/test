import mongoose from 'mongoose';
import { Product } from '../models/Product.model';
import { Category } from '../models/Category.model';
import { Brand } from '../models/Brand.model';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Use local URI if MONGODB_URI is not set in .env (like in .env.example)
let mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/brand-store';
if (mongoUri.includes('<username>')) {
  mongoUri = 'mongodb://127.0.0.1:27017/brand-store';
}


const CATEGORIES = [
  { name: 'Sneakers', slug: 'sneakers', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop' },
  { name: 'Sports Shoes', slug: 'sports-shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop' },
  { name: 'Loafers', slug: 'loafers', image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=600&auto=format&fit=crop' },
  { name: 'Boots', slug: 'boots', image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=600&auto=format&fit=crop' },
  { name: 'Chelsea Boots', slug: 'chelsea-boots', image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=600&auto=format&fit=crop' },
  { name: 'Formal Shoes', slug: 'formal-shoes', image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=600&auto=format&fit=crop' },
];

const BRANDS = [
  { name: 'Adidas', slug: 'adidas' },
  { name: 'New Balance', slug: 'new-balance' },
  { name: 'Reebok', slug: 'reebok' },
  { name: 'Woodland', slug: 'woodland' },
  { name: 'Red Chief', slug: 'red-chief' },
  { name: 'Wrangler', slug: 'wrangler' },
  { name: 'Camel Active', slug: 'camel-active' },
  { name: 'Bugatti', slug: 'bugatti' },
  { name: 'Prada', slug: 'prada' },
  { name: 'Cole Haan', slug: 'cole-haan' },
  { name: 'Zara', slug: 'zara' },
  { name: 'U.S. Polo Assn.', slug: 'us-polo-assn' },
  { name: 'Furo', slug: 'furo' },
  { name: 'ID', slug: 'id' },
  { name: 'Eram', slug: 'eram' },
  { name: 'H&M', slug: 'h-and-m' },
];

const SAMPLE_PRODUCTS = [
  {
    name: 'Aster Low Leather',
    slug: 'aster-low-leather',
    brand: 'U.S. Polo Assn.',
    category: 'Sneakers',
    price: 10499,
    compareAtPrice: 13999,
    rating: 4.7,
    numReviews: 218,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop',
    colors: ['White', 'Black'],
    sizes: ['7', '8', '9', '10', '11'],
  },
  {
    name: 'Kinetic Runner',
    slug: 'kinetic-runner',
    brand: 'Adidas',
    category: 'Sports Shoes',
    price: 11999,
    compareAtPrice: 0,
    rating: 4.8,
    numReviews: 512,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=600&auto=format&fit=crop',
    colors: ['Black', 'White', 'Grey'],
    sizes: ['7', '8', '9', '10', '11', '12'],
  },
  {
    name: 'Monarch Chelsea',
    slug: 'monarch-chelsea',
    brand: 'Cole Haan',
    category: 'Chelsea Boots',
    price: 17499,
    compareAtPrice: 20999,
    rating: 4.9,
    numReviews: 176,
    image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=600&auto=format&fit=crop',
    colors: ['Tan', 'Brown', 'Black'],
    sizes: ['8', '9', '10', '11'],
  },
  {
    name: 'Oxford Noir Cap-Toe',
    slug: 'oxford-noir-cap-toe',
    brand: 'Prada',
    category: 'Formal Shoes',
    price: 31499,
    compareAtPrice: 0,
    rating: 4.9,
    numReviews: 92,
    image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=600&auto=format&fit=crop',
    colors: ['Black'],
    sizes: ['8', '9', '10', '11'],
  },
  {
    name: 'Trail Blazer GTX',
    slug: 'trail-blazer-gtx',
    brand: 'Woodland',
    category: 'Boots',
    price: 14999,
    compareAtPrice: 18499,
    rating: 4.6,
    numReviews: 342,
    image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=600&auto=format&fit=crop',
    colors: ['Brown', 'Green', 'Grey'],
    sizes: ['7', '8', '9', '10', '11', '12'],
  },
  {
    name: 'Classic Penny Loafer',
    slug: 'classic-penny-loafer',
    brand: 'ID',
    category: 'Loafers',
    price: 12499,
    compareAtPrice: 0,
    rating: 4.5,
    numReviews: 89,
    image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=600&auto=format&fit=crop',
    colors: ['Brown', 'Black', 'Tan'],
    sizes: ['8', '9', '10', '11'],
  },
  {
    name: 'Fresh Foam X',
    slug: 'fresh-foam-x',
    brand: 'New Balance',
    category: 'Sports Shoes',
    price: 13499,
    compareAtPrice: 15999,
    rating: 4.7,
    numReviews: 428,
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=600&auto=format&fit=crop',
    colors: ['Grey', 'White', 'Navy'],
    sizes: ['7', '8', '9', '10', '11', '12', '13'],
  },
  {
    name: 'Urban Street Low',
    slug: 'urban-street-low',
    brand: 'Bugatti',
    category: 'Sneakers',
    price: 14499,
    compareAtPrice: 0,
    rating: 4.6,
    numReviews: 156,
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=600&auto=format&fit=crop',
    colors: ['Grey', 'White', 'Black'],
    sizes: ['7', '8', '9', '10', '11'],
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected for seeding...');

    // Clear existing data
    await Product.deleteMany();
    await Category.deleteMany();
    await Brand.deleteMany();
    console.log('🧹 Cleared existing data');

    // Insert Categories
    const insertedCategories = await Category.insertMany(CATEGORIES);
    console.log(`✅ Inserted ${insertedCategories.length} categories`);

    // Insert Brands
    const insertedBrands = await Brand.insertMany(BRANDS);
    console.log(`✅ Inserted ${insertedBrands.length} brands`);

    // Helper maps
    const categoryMap = insertedCategories.reduce((acc, cat) => {
      acc[cat.name] = cat._id;
      return acc;
    }, {} as Record<string, mongoose.Types.ObjectId>);

    const brandMap = insertedBrands.reduce((acc, brand) => {
      acc[brand.name] = brand._id;
      return acc;
    }, {} as Record<string, mongoose.Types.ObjectId>);

    // Prepare Products
    const productsToInsert = SAMPLE_PRODUCTS.map((product) => {
      return {
        name: product.name,
        slug: product.slug,
        description: `Experience the comfort and style of ${product.name}. Perfect for any occasion.`,
        shortDescription: `Premium ${product.category} from ${product.brand}`,
        brand: brandMap[product.brand],
        category: categoryMap[product.category],
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        discount: product.compareAtPrice > product.price ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) : 0,
        images: [product.image],
        colors: product.colors.map(c => ({ name: c, hex: c === 'Black' ? '#000000' : '#FFFFFF', images: [] })),
        sizes: product.sizes.map(s => ({ size: s, stock: 10 })),
        rating: product.rating,
        numReviews: product.numReviews,
        totalStock: product.sizes.length * 10,
        isFeatured: product.rating > 4.7,
        isNewArrival: false,
        isBestSeller: product.numReviews > 200,
        isOnSale: product.compareAtPrice > product.price,
        sku: `SKU-${product.slug.toUpperCase()}`,
        tags: [product.brand, product.category, ...product.colors],
        status: 'active',
      };
    });

    await Product.insertMany(productsToInsert);
    console.log(`✅ Inserted ${productsToInsert.length} products`);

    console.log('🎉 Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
