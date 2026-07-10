// Shared types for the admin dashboard.
// These mirror the backend Mongoose models but use plain strings for ids
// and allow populated-or-unpopulated refs (Mongo sometimes returns an id
// string, sometimes a populated object, depending on the route).

export type Ref<T> = string | (T & { _id: string });

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  website: string;
  isFeatured: boolean;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  parentCategory: Ref<Category> | null;
  productCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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

export interface ProductSpecification {
  key: string;
  value: string;
}

export type ProductGender = "men" | "women" | "unisex";
export type ProductStatus = "active" | "draft" | "archived";

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  brand: Ref<Brand>;
  category: Ref<Category>;
  price: number;
  compareAtPrice: number;
  discount: number;
  images: string[];
  colors: ProductColor[];
  sizes: ProductSize[];
  specifications: ProductSpecification[];
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
  gender: ProductGender;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  _id?: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export type UserRole = "user" | "admin";

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone: string;
  isEmailVerified: boolean;
  addresses: Address[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product: Ref<Product>;
  name: string;
  image: string;
  brand: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

export type PaymentMethod = "stripe" | "razorpay" | "cod";

export interface StatusHistoryEntry {
  status: string;
  timestamp: string;
  note: string;
}

export interface Order {
  _id: string;
  user: Ref<Pick<AdminUser, "name" | "email">>;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  discountAmount: number;
  totalPrice: number;
  couponCode: string;
  status: OrderStatus;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  trackingNumber: string;
  estimatedDelivery?: string;
  statusHistory: StatusHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export type DiscountType = "percentage" | "fixed";

export interface Coupon {
  _id: string;
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount?: number;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  recentOrders: Order[];
  monthlyRevenue: { _id: string; revenue: number; orders: number }[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Helper to safely pull a display value out of a ref that may or may not be populated
export function refName<T extends { name?: string }>(
  ref: Ref<T> | null | undefined,
  fallback = "—",
): string {
  if (!ref) return fallback;
  if (typeof ref === "string") return fallback;
  return ref.name ?? fallback;
}

export function refId<T>(ref: Ref<T> | null | undefined): string {
  if (!ref) return "";
  if (typeof ref === "string") return ref;
  return ref._id;
}
