import mongoose, { Document, Schema } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase: number;
  maxDiscount: number;
  validFrom: Date;
  validUntil: Date;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  applicableCategories: mongoose.Types.ObjectId[];
  applicableBrands: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: { type: String, default: '' },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true,
    },
    discountValue: {
      type: Number,
      required: [true, 'Discount value is required'],
      min: 0,
    },
    minPurchase: { type: Number, default: 0 },
    maxDiscount: { type: Number, default: 0 },
    validFrom: { type: Date, default: Date.now },
    validUntil: { type: Date, required: [true, 'Expiry date is required'] },
    usageLimit: { type: Number, default: 0 }, // 0 means unlimited
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    applicableCategories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    applicableBrands: [{ type: Schema.Types.ObjectId, ref: 'Brand' }],
  },
  { timestamps: true }
);

export const Coupon = mongoose.model<ICoupon>('Coupon', couponSchema);
