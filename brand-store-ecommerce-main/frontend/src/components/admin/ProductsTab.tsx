"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import {
  createProduct,
  deleteProduct,
  listBrands,
  listCategories,
  listProducts,
  updateProduct,
} from "@/lib/admin-api";
import {
  Brand,
  Category,
  Product,
  ProductSize,
  refId,
  refName,
} from "@/types/admin";

interface FormState {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  brand: string;
  category: string;
  price: string;
  compareAtPrice: string;
  images: string; // newline separated
  sizesText: string; // "S:10, M:5" style, one per line
  tags: string; // comma separated
  sku: string;
  material: string;
  weight: string;
  gender: "men" | "women" | "unisex";
  status: "active" | "draft" | "archived";
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isOnSale: boolean;
}

const EMPTY_FORM: FormState = {
  name: "",
  slug: "",
  description: "",
  shortDescription: "",
  brand: "",
  category: "",
  price: "",
  compareAtPrice: "",
  images: "",
  sizesText: "",
  tags: "",
  sku: "",
  material: "",
  weight: "",
  gender: "men",
  status: "active",
  isFeatured: false,
  isNewArrival: false,
  isBestSeller: false,
  isOnSale: false,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseSizes(text: string): ProductSize[] {
  return text
    .split(/\n|,/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [size, stock] = entry.split(":").map((s) => s.trim());
      return { size: size ?? entry, stock: Number(stock) || 0 };
    });
}

function sizesToText(sizes: ProductSize[]): string {
  return sizes.map((s) => `${s.size}:${s.stock}`).join("\n");
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  draft: "bg-muted text-muted-foreground",
  archived: "bg-red-500/10 text-red-600 dark:text-red-400",
};

export default function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      const [{ items }, brandList, categoryList] = await Promise.all([
        listProducts(),
        listBrands(),
        listCategories(),
      ]);
      setProducts(items);
      setBrands(brandList);
      setCategories(categoryList);
    } catch {
      toast.error("Couldn't load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        refName(p.brand).toLowerCase().includes(q),
    );
  }, [products, search]);

  function openCreate() {
    setEditing(null);
    setForm({
      ...EMPTY_FORM,
      brand: brands[0]?._id ?? "",
      category: categories[0]?._id ?? "",
    });
    setDialogOpen(true);
  }

  function openEdit(product: Product) {
    setEditing(product);
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.shortDescription ?? "",
      brand: refId(product.brand),
      category: refId(product.category),
      price: String(product.price ?? ""),
      compareAtPrice: String(product.compareAtPrice ?? ""),
      images: (product.images ?? []).join("\n"),
      sizesText: sizesToText(product.sizes ?? []),
      tags: (product.tags ?? []).join(", "),
      sku: product.sku ?? "",
      material: product.material ?? "",
      weight: String(product.weight ?? ""),
      gender: product.gender ?? "men",
      status: product.status ?? "active",
      isFeatured: product.isFeatured,
      isNewArrival: product.isNewArrival,
      isBestSeller: product.isBestSeller,
      isOnSale: product.isOnSale,
    });
    setDialogOpen(true);
  }

  async function handleSubmit() {
    if (!form.name.trim() || !form.brand || !form.category || !form.price) {
      toast.error("Name, brand, category and price are required");
      return;
    }
    setSaving(true);
    try {
      const images = form.images
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      const payload: Partial<Product> = {
        name: form.name,
        slug: form.slug || slugify(form.name),
        description: form.description,
        shortDescription: form.shortDescription,
        brand: form.brand,
        category: form.category,
        price: Number(form.price),
        compareAtPrice: Number(form.compareAtPrice) || 0,
        images: images.length
          ? images
          : ["https://placehold.co/600x800?text=No+Image"],
        sizes: parseSizes(form.sizesText),
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        sku: form.sku,
        material: form.material,
        weight: Number(form.weight) || 0,
        gender: form.gender,
        status: form.status,
        isFeatured: form.isFeatured,
        isNewArrival: form.isNewArrival,
        isBestSeller: form.isBestSeller,
        isOnSale: form.isOnSale,
      };
      if (editing) {
        await updateProduct(editing._id, payload);
        toast.success("Product updated");
      } else {
        await createProduct(payload);
        toast.success("Product created");
      }
      setDialogOpen(false);
      refresh();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Couldn't save product");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteProduct(deleteTarget._id);
      toast.success("Product deleted");
      setProducts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
    } catch {
      toast.error("Couldn't delete product");
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold">Products</h3>
          <p className="text-xs text-muted-foreground">
            {products.length} total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, SKU, brand…"
            className="w-full sm:w-64"
          />
          <Button onClick={openCreate} size="sm" className="gap-1.5 shrink-0">
            <Plus className="h-4 w-4" /> New product
          </Button>
        </div>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Loading products…
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            {products.length === 0
              ? "No products yet. Create your first one to get started."
              : "No products match your search."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Product</th>
                  <th className="px-5 py-3 font-medium">Brand</th>
                  <th className="px-5 py-3 font-medium">Price</th>
                  <th className="px-5 py-3 font-medium">Stock</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product._id} className="border-b last:border-0">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {product.images?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-10 w-10 rounded-md object-cover border"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-muted" />
                        )}
                        <div className="min-w-0">
                          <p className="font-medium truncate max-w-[220px]">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {product.sku}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {refName(product.brand)}
                    </td>
                    <td className="px-5 py-3 tabular-nums">
                      {formatCurrency(product.price)}
                      {product.compareAtPrice > product.price && (
                        <span className="ml-1.5 text-xs text-muted-foreground line-through">
                          {formatCurrency(product.compareAtPrice)}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 tabular-nums">
                      {product.totalStock}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[product.status]}`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTarget(product)}
                          className="text-[var(--brand-red)] hover:text-[var(--brand-red)]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit product" : "New product"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? "Update this product's details."
                : "Add a new product to the catalog."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="p-name">Name</Label>
              <Input
                id="p-name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Air Max 90"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-slug">Slug</Label>
              <Input
                id="p-slug"
                value={form.slug}
                onChange={(e) =>
                  setForm((f) => ({ ...f, slug: e.target.value }))
                }
                placeholder={slugify(form.name) || "air-max-90"}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-sku">SKU</Label>
              <Input
                id="p-sku"
                value={form.sku}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sku: e.target.value }))
                }
                placeholder="AM90-BLK-42"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Brand</Label>
              <Select
                value={form.brand}
                onValueChange={(v) => setForm((f) => ({ ...f, brand: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((b) => (
                    <SelectItem key={b._id} value={b._id}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-price">Price (₹)</Label>
              <Input
                id="p-price"
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: e.target.value }))
                }
                placeholder="4999"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-compare">Compare-at price (₹)</Label>
              <Input
                id="p-compare"
                type="number"
                value={form.compareAtPrice}
                onChange={(e) =>
                  setForm((f) => ({ ...f, compareAtPrice: e.target.value }))
                }
                placeholder="5999"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Gender</Label>
              <Select
                value={form.gender}
                onValueChange={(v: any) =>
                  setForm((f) => ({ ...f, gender: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="men">Men</SelectItem>
                  <SelectItem value="women">Women</SelectItem>
                  <SelectItem value="unisex">Unisex</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v: any) =>
                  setForm((f) => ({ ...f, status: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-material">Material</Label>
              <Input
                id="p-material"
                value={form.material}
                onChange={(e) =>
                  setForm((f) => ({ ...f, material: e.target.value }))
                }
                placeholder="Mesh & rubber"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-weight">Weight (g)</Label>
              <Input
                id="p-weight"
                type="number"
                value={form.weight}
                onChange={(e) =>
                  setForm((f) => ({ ...f, weight: e.target.value }))
                }
                placeholder="450"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="p-short">Short description</Label>
              <Input
                id="p-short"
                value={form.shortDescription}
                onChange={(e) =>
                  setForm((f) => ({ ...f, shortDescription: e.target.value }))
                }
                placeholder="One-line summary shown on listing cards"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="p-description">Description</Label>
              <Textarea
                id="p-description"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={3}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="p-images">Image URLs (one per line)</Label>
              <Textarea
                id="p-images"
                value={form.images}
                onChange={(e) =>
                  setForm((f) => ({ ...f, images: e.target.value }))
                }
                rows={3}
                placeholder="https://example.com/image1.jpg"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="p-sizes">
                Sizes & stock (one per line, format size:stock)
              </Label>
              <Textarea
                id="p-sizes"
                value={form.sizesText}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sizesText: e.target.value }))
                }
                rows={3}
                placeholder={"S:12\nM:20\nL:8"}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="p-tags">Tags (comma separated)</Label>
              <Input
                id="p-tags"
                value={form.tags}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tags: e.target.value }))
                }
                placeholder="running, lightweight, summer"
              />
              {form.tags.trim() && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {form.tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                </div>
              )}
            </div>
            <div className="sm:col-span-2 grid grid-cols-2 gap-3">
              {(
                [
                  ["isFeatured", "Featured"],
                  ["isNewArrival", "New arrival"],
                  ["isBestSeller", "Best seller"],
                  ["isOnSale", "On sale"],
                ] as const
              ).map(([key, label]) => (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <p className="text-sm font-medium">{label}</p>
                  <Switch
                    checked={form[key]}
                    onCheckedChange={(checked) =>
                      setForm((f) => ({ ...f, [key]: checked }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving ? "Saving…" : editing ? "Save changes" : "Create product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete product?"
        description={`This will permanently remove "${deleteTarget?.name}" from the catalog.`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
