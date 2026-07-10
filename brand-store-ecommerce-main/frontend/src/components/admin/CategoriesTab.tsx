"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { BooleanBadge } from "@/components/admin/Statusbadge";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
} from "@/lib/admin-api";
import { Category, refId, refName } from "@/types/admin";

const EMPTY_FORM = {
  name: "",
  slug: "",
  image: "",
  description: "",
  parentCategory: "none",
  isActive: true,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function CategoriesTab() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      setCategories(await listCategories());
    } catch {
      toast.error("Couldn't load categories");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }

  function openEdit(category: Category) {
    setEditing(category);
    setForm({
      name: category.name,
      slug: category.slug,
      image: category.image,
      description: category.description,
      parentCategory: refId(category.parentCategory) || "none",
      isActive: category.isActive,
    });
    setDialogOpen(true);
  }

  async function handleSubmit() {
    if (!form.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        slug: form.slug || slugify(form.name),
        image: form.image,
        description: form.description,
        isActive: form.isActive,
        parentCategory:
          form.parentCategory === "none" ? null : form.parentCategory,
      };
      if (editing) {
        await updateCategory(editing._id, payload);
        toast.success("Category updated");
      } else {
        await createCategory(payload);
        toast.success("Category created");
      }
      setDialogOpen(false);
      refresh();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Couldn't save category");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteCategory(deleteTarget._id);
      toast.success("Category deleted");
      setCategories((prev) => prev.filter((c) => c._id !== deleteTarget._id));
    } catch {
      toast.error("Couldn't delete category");
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Categories</h3>
          <p className="text-xs text-muted-foreground">
            {categories.length} total
          </p>
        </div>
        <Button onClick={openCreate} size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" /> New category
        </Button>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Loading categories…
          </div>
        ) : categories.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No categories yet. Create your first one to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Parent</th>
                  <th className="px-5 py-3 font-medium">Products</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category._id} className="border-b last:border-0">
                    <td className="px-5 py-3">
                      <p className="font-medium">{category.name}</p>
                      <p className="text-xs text-muted-foreground">
                        /{category.slug}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {category.parentCategory
                        ? refName(category.parentCategory, "—")
                        : "—"}
                    </td>
                    <td className="px-5 py-3 tabular-nums">
                      {category.productCount}
                    </td>
                    <td className="px-5 py-3">
                      <BooleanBadge
                        value={category.isActive}
                        trueLabel="Active"
                        falseLabel="Hidden"
                      />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(category)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTarget(category)}
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
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit category" : "New category"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? "Update this category's details."
                : "Add a new category to the catalog."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="cat-name">Name</Label>
              <Input
                id="cat-name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Sneakers"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cat-slug">Slug</Label>
              <Input
                id="cat-slug"
                value={form.slug}
                onChange={(e) =>
                  setForm((f) => ({ ...f, slug: e.target.value }))
                }
                placeholder={slugify(form.name) || "sneakers"}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cat-image">Image URL</Label>
              <Input
                id="cat-image"
                value={form.image}
                onChange={(e) =>
                  setForm((f) => ({ ...f, image: e.target.value }))
                }
                placeholder="https://…"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Parent category</Label>
              <Select
                value={form.parentCategory}
                onValueChange={(value) =>
                  setForm((f:any) => ({ ...f, parentCategory: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {categories
                    .filter((c) => c._id !== editing?._id)
                    .map((c) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cat-description">Description</Label>
              <Textarea
                id="cat-description"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={3}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Active</p>
                <p className="text-xs text-muted-foreground">
                  Visible in the storefront
                </p>
              </div>
              <Switch
                checked={form.isActive}
                onCheckedChange={(checked) =>
                  setForm((f) => ({ ...f, isActive: checked }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving
                ? "Saving…"
                : editing
                  ? "Save changes"
                  : "Create category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete category?"
        description={`This will permanently remove "${deleteTarget?.name}". Products in this category will keep a reference to a category that no longer exists.`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
