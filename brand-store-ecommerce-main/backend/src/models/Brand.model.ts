import mongoose, { Document, Schema } from 'mongoose';

export interface IBrand extends Document {
  name: string;
  slug: string;
  logo: string;
  description: string;
  website: string;
  isFeatured: boolean;
  productCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const brandSchema = new Schema<IBrand>(
  {
    name: {
      type: String,
      required: [true, 'Brand name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    logo: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    productCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Brand = mongoose.model<IBrand>('Brand', brandSchema);
