"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
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
import { BooleanBadge } from "@/components/admin/StatusBadge";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import {
  createCoupon,
  deleteCoupon,
  listCoupons,
  updateCoupon,
} from "@/lib/admin-api";
import { Coupon, DiscountType } from "@/types/admin";

interface FormState {
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: string;
  minPurchase: string;
  maxDiscount: string;
  usageLimit: string;
  expiresAt: string;
  isActive: boolean;
}

const EMPTY_FORM: FormState = {
  code: "",
  description: "",
  discountType: "percentage",
  discountValue: "",
  minPurchase: "",
  maxDiscount: "",
  usageLimit: "",
  expiresAt: "",
  isActive: true,
};

function formatDate(date?: string) {
  if (!date) return "No expiry";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function CouponsTab() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      setCoupons(await listCoupons());
    } catch {
      toast.error("Couldn't load coupons");
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

  function openEdit(coupon: Coupon) {
    setEditing(coupon);
    setForm({
      code: coupon.code,
      description: coupon.description ?? "",
      discountType: coupon.discountType,
      discountValue: String(coupon.discountValue ?? ""),
      minPurchase: String(coupon.minPurchase ?? ""),
      maxDiscount: String(coupon.maxDiscount ?? ""),
      usageLimit: String(coupon.usageLimit ?? ""),
      expiresAt: coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : "",
      isActive: coupon.isActive,
    });
    setDialogOpen(true);
  }

  async function handleSubmit() {
    if (!form.code.trim() || !form.discountValue) {
      toast.error("Code and discount value are required");
      return;
    }
    setSaving(true);
    try {
      const payload: Partial<Coupon> = {
        code: form.code.trim().toUpperCase(),
        description: form.description,
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minPurchase: form.minPurchase ? Number(form.minPurchase) : undefined,
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
        expiresAt: form.expiresAt || undefined,
        isActive: form.isActive,
      };
      if (editing) {
        await updateCoupon(editing._id, payload);
        toast.success("Coupon updated");
      } else {
        await createCoupon(payload);
        toast.success("Coupon created");
      }
      setDialogOpen(false);
      refresh();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Couldn't save coupon");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteCoupon(deleteTarget._id);
      toast.success("Coupon deleted");
      setCoupons((prev) => prev.filter((c) => c._id !== deleteTarget._id));
    } catch {
      toast.error("Couldn't delete coupon");
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Coupons</h3>
          <p className="text-xs text-muted-foreground">
            {coupons.length} total
          </p>
        </div>
        <Button onClick={openCreate} size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" /> New coupon
        </Button>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Loading coupons…
          </div>
        ) : coupons.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No coupons yet. Create your first one to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Code</th>
                  <th className="px-5 py-3 font-medium">Discount</th>
                  <th className="px-5 py-3 font-medium">Usage</th>
                  <th className="px-5 py-3 font-medium">Expires</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon._id} className="border-b last:border-0">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-mono font-medium">
                          {coupon.code}
                        </span>
                      </div>
                      {coupon.description && (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {coupon.description}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3 tabular-nums">
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue}%`
                        : `₹${coupon.discountValue}`}
                    </td>
                    <td className="px-5 py-3 tabular-nums text-muted-foreground">
                      {coupon.usedCount ?? 0}
                      {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {formatDate(coupon.expiresAt)}
                    </td>
                    <td className="px-5 py-3">
                      <BooleanBadge
                        value={coupon.isActive}
                        trueLabel="Active"
                        falseLabel="Inactive"
                      />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(coupon)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTarget(coupon)}
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
            <DialogTitle>{editing ? "Edit coupon" : "New coupon"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Update this coupon's details."
                : "Create a new discount coupon."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="c-code">Code</Label>
              <Input
                id="c-code"
                value={form.code}
                onChange={(e) =>
                  setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))
                }
                placeholder="WELCOME10"
                className="font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-description">Description</Label>
              <Textarea
                id="c-description"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={2}
                placeholder="10% off for first-time customers"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Discount type</Label>
                <Select
                  value={form.discountType}
                  onValueChange={(v: DiscountType) =>
                    setForm((f) => ({ ...f, discountType: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-value">
                  {form.discountType === "percentage"
                    ? "Discount (%)"
                    : "Discount (₹)"}
                </Label>
                <Input
                  id="c-value"
                  type="number"
                  value={form.discountValue}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, discountValue: e.target.value }))
                  }
                  placeholder={
                    form.discountType === "percentage" ? "10" : "200"
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="c-min">Min. purchase (₹)</Label>
                <Input
                  id="c-min"
                  type="number"
                  value={form.minPurchase}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, minPurchase: e.target.value }))
                  }
                  placeholder="999"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-max">Max discount (₹)</Label>
                <Input
                  id="c-max"
                  type="number"
                  value={form.maxDiscount}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, maxDiscount: e.target.value }))
                  }
                  placeholder="500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="c-limit">Usage limit</Label>
                <Input
                  id="c-limit"
                  type="number"
                  value={form.usageLimit}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, usageLimit: e.target.value }))
                  }
                  placeholder="100"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-expires">Expires on</Label>
                <Input
                  id="c-expires"
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, expiresAt: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Active</p>
                <p className="text-xs text-muted-foreground">
                  Can be applied at checkout
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
              {saving ? "Saving…" : editing ? "Save changes" : "Create coupon"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete coupon?"
        description={`This will permanently remove the coupon "${deleteTarget?.code}".`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
