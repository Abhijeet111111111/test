import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  brand: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  price: number;
  compareAtPrice: number;
  discount: number;
  images: string[];
  colors: { name: string; hex: string; images: string[] }[];
  sizes: { size: string; stock: number }[];
  specifications: { key: string; value: string }[];
  rating: number;
  numReviews: number;
  totalStock: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isOnSale: boolean;
  tags: string[];
  sku: string;
  weight: number;
  material: string;
  gender: 'men' | 'women' | 'unisex';
  status: 'active' | 'draft' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    shortDescription: {
      type: String,
      maxlength: [500, 'Short description cannot exceed 500 characters'],
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
      required: [true, 'Product brand is required'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category is required'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price must be positive'],
    },
    compareAtPrice: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%'],
    },
    images: {
      type: [String],
      required: [true, 'At least one image is required'],
    },
    colors: [
      {
        name: { type: String, required: true },
        hex: { type: String, required: true },
        images: [String],
      },
    ],
    sizes: [
      {
        size: { type: String, required: true },
        stock: { type: Number, required: true, default: 0 },
      },
    ],
    specifications: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot exceed 5'],
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    totalStock: {
      type: Number,
      default: 0,
    },
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isOnSale: { type: Boolean, default: false },
    tags: [{ type: String }],
    sku: { type: String, unique: true },
    weight: { type: Number },
    material: { type: String },
    gender: {
      type: String,
      enum: ['men', 'women', 'unisex'],
      default: 'men',
    },
    status: {
      type: String,
      enum: ['active', 'draft', 'archived'],
      default: 'active',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for search and filtering
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ brand: 1, category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ slug: 1 });

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function () {
  if (this.compareAtPrice && this.compareAtPrice > this.price) {
    return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
  }
  return 0;
});

// Pre-save: calculate totalStock from sizes
productSchema.pre('save', function () {
  if (this.sizes && this.sizes.length > 0) {
    this.totalStock = this.sizes.reduce((total, size) => total + size.stock, 0);
  }
});

export const Product = mongoose.model<IProduct>('Product', productSchema);
