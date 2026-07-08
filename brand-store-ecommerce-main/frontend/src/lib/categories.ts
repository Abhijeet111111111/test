import api from "./api";
import { Category } from "./types";

function normalizeCategory(raw: any): Category {
  const { _id, __v, ...rest } = raw;
  return {
    ...rest,
    id: String(_id),
  };
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  try {
    const res = await api.get(`/categories/${slug}`);
    const raw = res.data.data ?? res.data;
    return normalizeCategory(raw);
  } catch (err: any) {
    if (err?.response?.status === 404) return null;
    throw err;
  }
}

export async function getAllCategories(): Promise<Category[]> {
  const res = await api.get("/categories");
  const list = res.data.data ?? res.data;
  return list.map(normalizeCategory);
}
