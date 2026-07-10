import api from "@/lib/api";
import {
  Brand,
  Category,
  Coupon,
  DashboardStats,
  Order,
  OrderStatus,
  Pagination,
  Product,
  AdminUser,
} from "@/types/admin";

// Every route on this backend nests the payload under `data`, whether or not
// a `success` flag is also present, so we can unwrap generically.
function unwrap<T>(payload: unknown): T {
  const body = payload as { data?: T };
  return (body?.data ?? (payload as T)) as T;
}

// ---------- Dashboard ----------
export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await api.get("/admin/dashboard");
  return unwrap<DashboardStats>(res.data);
}

// ---------- Products ----------
// No dedicated admin listing route exists, so we reuse the public product
// listing endpoint and fall back gracefully across a couple of possible
// response shapes.
export async function listProducts(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<{ items: Product[]; pagination?: Pagination }> {
  const res = await api.get("/products", { params: { limit: 100, ...params } });
  const body = res.data;
  const raw = body?.data ?? body;
  const items: Product[] = Array.isArray(raw) ? raw : (raw?.products ?? []);
  const pagination: Pagination | undefined =
    body?.pagination ?? raw?.pagination;
  return { items, pagination };
}

export async function createProduct(
  payload: Partial<Product>,
): Promise<Product> {
  const res = await api.post("/admin/products", payload);
  return unwrap<Product>(res.data);
}

export async function updateProduct(
  id: string,
  payload: Partial<Product>,
): Promise<Product> {
  const res = await api.put(`/admin/products/${id}`, payload);
  return unwrap<Product>(res.data);
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/admin/products/${id}`);
}

// ---------- Brands ----------
export async function listBrands(): Promise<Brand[]> {
  const res = await api.get("/brands");
  const body = res.data;
  const raw = body?.data ?? body;
  return Array.isArray(raw) ? raw : (raw?.brands ?? []);
}

export async function createBrand(payload: Partial<Brand>): Promise<Brand> {
  const res = await api.post("/admin/brands", payload);
  return unwrap<Brand>(res.data);
}

export async function updateBrand(
  id: string,
  payload: Partial<Brand>,
): Promise<Brand> {
  const res = await api.put(`/admin/brands/${id}`, payload);
  return unwrap<Brand>(res.data);
}

export async function deleteBrand(id: string): Promise<void> {
  await api.delete(`/admin/brands/${id}`);
}

// ---------- Categories ----------
export async function listCategories(): Promise<Category[]> {
  const res = await api.get("/categories");
  const body = res.data;
  const raw = body?.data ?? body;
  return Array.isArray(raw) ? raw : (raw?.categories ?? []);
}

export async function createCategory(
  payload: Partial<Category>,
): Promise<Category> {
  const res = await api.post("/admin/categories", payload);
  return unwrap<Category>(res.data);
}

export async function updateCategory(
  id: string,
  payload: Partial<Category>,
): Promise<Category> {
  const res = await api.put(`/admin/categories/${id}`, payload);
  return unwrap<Category>(res.data);
}

export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`/admin/categories/${id}`);
}

// ---------- Orders ----------
export async function listOrders(params?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<{ items: Order[]; pagination?: Pagination }> {
  const res = await api.get("/admin/orders", { params });
  return {
    items: res.data?.data ?? [],
    pagination: res.data?.pagination,
  };
}

export async function updateOrder(
  id: string,
  payload: { status?: OrderStatus; trackingNumber?: string },
): Promise<Order> {
  const res = await api.put(`/admin/orders/${id}`, payload);
  return unwrap<Order>(res.data);
}

// ---------- Users ----------
export async function listUsers(): Promise<AdminUser[]> {
  const res = await api.get("/admin/users");
  return unwrap<AdminUser[]>(res.data);
}

// ---------- Coupons ----------
export async function listCoupons(): Promise<Coupon[]> {
  const res = await api.get("/admin/coupons");
  return unwrap<Coupon[]>(res.data);
}

export async function createCoupon(payload: Partial<Coupon>): Promise<Coupon> {
  const res = await api.post("/admin/coupons", payload);
  return unwrap<Coupon>(res.data);
}

export async function updateCoupon(
  id: string,
  payload: Partial<Coupon>,
): Promise<Coupon> {
  const res = await api.put(`/admin/coupons/${id}`, payload);
  return unwrap<Coupon>(res.data);
}

export async function deleteCoupon(id: string): Promise<void> {
  await api.delete(`/admin/coupons/${id}`);
}
