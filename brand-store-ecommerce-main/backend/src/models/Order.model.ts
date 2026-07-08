import mongoose, { Document, Schema } from "mongoose";

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  orderNumber: string;
  items: {
    product: mongoose.Types.ObjectId;
    name: string;
    image: string;
    brand: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: "stripe" | "razorpay" | "cod";
  paymentResult: {
    id: string;
    status: string;
    updateTime: string;
    emailAddress: string;
  };
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  discountAmount: number;
  totalPrice: number;
  couponCode: string;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "returned";
  isPaid: boolean;
  paidAt: Date;
  isDelivered: boolean;
  deliveredAt: Date;
  trackingNumber: string;
  estimatedDelivery: Date;
  statusHistory: {
    status: string;
    timestamp: Date;
    note: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      default: () =>
        `BS-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 7)
          .toUpperCase()}`,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        image: { type: String, required: true },
        brand: { type: String, required: true },
        size: { type: String, required: true },
        color: { type: String },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["stripe", "razorpay", "cod"],
    },
    paymentResult: {
      id: String,
      status: String,
      updateTime: String,
      emailAddress: String,
    },
    itemsPrice: { type: Number, required: true, default: 0 },
    taxPrice: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    discountAmount: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true, default: 0 },
    couponCode: { type: String, default: "" },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
      ],
      default: "pending",
    },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    trackingNumber: { type: String, default: "" },
    estimatedDelivery: { type: Date },
    statusHistory: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        note: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true },
);

// Generate order number before saving
// orderSchema.pre("save", function (next) {
//   if (!this.orderNumber) {
//     this.orderNumber = `BS-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
//   }
//   next();
// });

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });

export const Order = mongoose.model<IOrder>("Order", orderSchema);
