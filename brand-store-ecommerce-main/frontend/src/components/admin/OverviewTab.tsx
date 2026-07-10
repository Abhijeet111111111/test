"use client";

import { useEffect, useState } from "react";
import { Package, ShoppingBag, Users, IndianRupee } from "lucide-react";
import { toast } from "sonner";
import StatCard from "@/components/admin/Statcard";
import { OrderStatusBadge } from "@/components/admin/Statusbadge";
import { getDashboardStats } from "@/lib/admin-api";
import { DashboardStats } from "@/types/admin";
import { refName } from "@/types/admin";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function OverviewTab() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getDashboardStats();
        if (active) setStats(data);
      } catch {
        toast.error("Couldn't load dashboard stats");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-xl border bg-muted/40"
          />
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
        Dashboard stats aren&apos;t available right now. Try refreshing the
        page.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon={IndianRupee}
          accent="red"
        />
        <StatCard
          label="Total orders"
          value={stats.totalOrders.toLocaleString()}
          icon={ShoppingBag}
        />
        <StatCard
          label="Total products"
          value={stats.totalProducts.toLocaleString()}
          icon={Package}
        />
        <StatCard
          label="Total users"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
        />
      </div>

      <div className="rounded-xl border bg-card">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h3 className="text-sm font-semibold">Recent orders</h3>
          <span className="text-xs text-muted-foreground">
            Last {stats.recentOrders.length} orders
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-8 text-center text-muted-foreground"
                  >
                    No orders yet.
                  </td>
                </tr>
              ) : (
                stats.recentOrders.map((order) => (
                  <tr key={order._id} className="border-b last:border-0">
                    <td className="px-5 py-3 font-mono text-xs">
                      {order.orderNumber}
                    </td>
                    <td className="px-5 py-3">
                      {refName(order.user, "Guest")}
                    </td>
                    <td className="px-5 py-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums">
                      {formatCurrency(order.totalPrice)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
