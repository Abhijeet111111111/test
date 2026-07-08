// Product types
// lib/types.ts
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  brand: Brand;
  category: Category;
  price: number;
  compareAtPrice: number;
  discount: number;
  images: string[];
  colors: ProductColor[];
  sizes: ProductSize[];
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
  gender: "men" | "women" | "unisex";
  status: "active" | "draft" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface ProductResponse {
  success: boolean;
  data: Product;
}

export interface ProductColor {
  name: string;
  hex: string;
  images: string[];
}

export interface ProductSize {
  size: string;
  stock: number;
}

// Brand types
export interface Brand {
  _id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  website: string;
  isFeatured: boolean;
  productCount: number;
}

// Category types
export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  parentCategory: string | null;
  productCount: number;
  isActive: boolean;
}


// User types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar: string;
  phone: string;
  isEmailVerified: boolean;
  addresses: Address[];
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  _id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

// Cart types
export interface CartItem {
  _id: string;
  product: Product;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalPrice: number;
}

// Order types
export interface Order {
  _id: string;
  orderNumber: string;
  user: User;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: 'stripe' | 'razorpay' | 'cod';
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
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  isPaid: boolean;
  paidAt: string;
  isDelivered: boolean;
  deliveredAt: string;
  trackingNumber: string;
  estimatedDelivery: string;
  statusHistory: { status: string; timestamp: string; note: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product: string;
  name: string;
  image: string;
  brand: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

// Review types
export interface Review {
  _id: string;
  user: { name: string; avatar: string };
  product: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  helpful: number;
  images: string[];
  createdAt: string;
}

// Coupon types
export interface Coupon {
  _id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase: number;
  maxDiscount: number;
  validFrom: string;
  validUntil: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Auth types
export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

