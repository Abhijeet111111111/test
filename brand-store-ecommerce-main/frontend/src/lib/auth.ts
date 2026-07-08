// lib/auth.ts
import api from "./api";
import type { User } from "@/types";

export async function getCurrentUser(): Promise<User> {
  const res = await api.get("/auth/me"); // adjust path if your backend differs
  return res.data.data ?? res.data.user ?? res.data;
}
