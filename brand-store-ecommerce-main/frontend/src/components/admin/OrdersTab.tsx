"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Truck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { OrderStatusBadge } from "@/components/admin/StatusBadge";
import { listOrders, updateOrder } from "@/lib/admin-api";
import { Order, OrderStatus, Pagination, refName } from "@/types/admin";

const STATUS_OPTIONS: (OrderStatus | "all")[] = [
  "all",
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Order | null>(null);
  const [statusValue, setStatusValue] = useState<OrderStatus>("pending");
  const [trackingValue, setTrackingValue] = useState("");
  const [saving, setSaving] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const { items, pagination: p } = await listOrders({
        page,
        limit: 15,
        status: statusFilter === "all" ? undefined : statusFilter,
      });
      setOrders(items);
      setPagination(p ?? null);
    } catch {
      toast.error("Couldn't load orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter]);

  function openEdit(order: Order) {
    setEditing(order);
    setStatusValue(order.status);
    setTrackingValue(order.trackingNumber ?? "");
  }

  async function handleSubmit() {
    if (!editing) return;
    setSaving(true);
    try {
      await updateOrder(editing._id, {
        status: statusValue,
        trackingNumber: trackingValue,
      });
      toast.success("Order updated");
      setEditing(null);
      refresh();
    } catch {
      toast.error("Couldn't update order");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold">Orders</h3>
          <p className="text-xs text-muted-foreground">
            {pagination ? `${pagination.total} total` : "Loading…"}
          </p>
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v: OrderStatus | "all") => {
            setStatusFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s === "all" ? "All statuses" : s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Loading orders…
          </div>
        ) : orders.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No orders match this filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Payment</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Total</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b last:border-0">
                    <td className="px-5 py-3 font-mono text-xs">
                      {order.orderNumber}
                    </td>
                    <td className="px-5 py-3">
                      <p>{refName(order.user, "Guest")}</p>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-5 py-3">
                      <span className="uppercase text-xs text-muted-foreground">
                        {order.paymentMethod}
                      </span>
                      {order.isPaid && (
                        <span className="ml-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                          Paid
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums">
                      {formatCurrency(order.totalPrice)}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(order)}
                        >
                          <Truck className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-between border-t px-5 py-3">
            <p className="text-xs text-muted-foreground">
              Page {pagination.page} of {pagination.pages}
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                disabled={page >= pagination.pages}
                onClick={() =>
                  setPage((p) => Math.min(pagination.pages, p + 1))
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update order {editing?.orderNumber}</DialogTitle>
            <DialogDescription>
              Change the fulfillment status and tracking number.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={statusValue}
                onValueChange={(v: OrderStatus) => setStatusValue(v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.filter((s) => s !== "all").map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tracking">Tracking number</Label>
              <Input
                id="tracking"
                value={trackingValue}
                onChange={(e) => setTrackingValue(e.target.value)}
                placeholder="e.g. IN482910334"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
