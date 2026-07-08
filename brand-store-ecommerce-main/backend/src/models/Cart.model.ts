import mongoose, { Document, Schema } from 'mongoose';

// Cart Model
export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: {
    product: mongoose.Types.ObjectId;
    size: string;
    color: string;
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

const cartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        size: { type: String, required: true },
        color: { type: String, default: '' },
        quantity: { type: Number, required: true, min: 1, default: 1 },
        price: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Cart = mongoose.model<ICart>('Cart', cartSchema);

// Wishlist Model
export interface IWishlist extends Document {
  user: mongoose.Types.ObjectId;
  products: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const wishlistSchema = new Schema<IWishlist>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  { timestamps: true }
);

export const Wishlist = mongoose.model<IWishlist>('Wishlist', wishlistSchema);

// Notification Model
export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  type: 'order' | 'promo' | 'system' | 'review';
  title: string;
  message: string;
  link: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['order', 'promo', 'system', 'review'],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String, default: '' },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
