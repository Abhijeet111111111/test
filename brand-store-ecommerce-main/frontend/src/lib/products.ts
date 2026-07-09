// lib/products.ts
import api from "./api";
import { Product,ProductResponse } from "./types";

// Turns a raw MongoDB product (with _id) into a plain, safe object with `id: string`.
// This is the actual fix for the ObjectId error — do this immediately after every fetch.
function normalizeProduct(raw: any): Product {
  const { _id, __v,category, ...rest } = raw;
  category.id = String(category._id);
  delete category._id;
  return {
    ...rest,
    category,
    id: String(_id), // force to plain string, no matter what shape _id is
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    // const res = await api.get<ProductResponse>(`/products/${slug}`);
    const res = await api.get(`/products/${slug}`);
    const raw = res.data.data ?? res.data; // adjust if your shape differs
    return  normalizeProduct(raw);
  } catch (err: any) {
    if (err?.response?.status === 404) return null;
    throw err;
  }
}

export async function getProductsByCategory(
  category: string,
): Promise<Product[]> {
  const res = await api.get("/products", { params: { category } });
  const list = res.data.data ?? res.data; // adjust if your shape differs
  return list.map(normalizeProduct);
}

export async function getRelatedProducts(
  excludeId: string,
  limit = 4,
): Promise<Product[]> {
  const res = await api.get("/products", { params: { limit: limit + 1 } });
  console.log(res.data.data);
  const list = res.data.data ?? res.data;
  return list
    .map(normalizeProduct)
    .filter((p: Product) => p.id !== excludeId)
    .slice(0, limit);
}

export async function getAllProducts(): Promise<Product[]> {
  const res = await api.get("/products");
  const list = res.data.data ?? res.data;
  return list.map(normalizeProduct);
}
