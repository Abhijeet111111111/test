"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { RootState } from "@/store";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tags,
  Ticket,
  TrendingUp,
} from "lucide-react";

// Shadcn UI Imports (Adjust paths if your components folder is different)
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// TypeScript Interface based on your backend response
interface DashboardData {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  recentOrders: any[];
  monthlyRevenue: any[];
}
export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  const [activeTab, setActiveTab] = useState("overview");

  // 1. Define ALL hooks at the very top (including useQuery)
  const { data, isLoading, error } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: DashboardData }>(
        "/admin/dashboard",
      );
      return response.data.data;
    },
    // Safe guard: only fetch if the user is authenticated AND an admin
    enabled: !!isAuthenticated && user?.role === "admin",
  });

  // 2. Handle the redirect side-effect
  useEffect(() => {
    if (isAuthenticated && user?.role !== "admin") {
      router.push("/");
    }
  }, [isAuthenticated, user?.role, router]);

  // 3. Now it is completely safe to do early returns for UI rendering
  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="flex h-screen items-center justify-center pt-20">
        Checking authorization...
      </div>
    );
  }

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center pt-20">
        Loading dashboard...
      </div>
    );
  if (error)
    return (
      <div className="flex h-screen items-center justify-center text-red-500 pt-20">
        Error loading data.
      </div>
    );

  return (
    <div className="container mx-auto max-w-[1400px] px-4 py-24 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Admin Control Panel
          </h1>
          <p className="text-muted-foreground">
            Manage your store, products, and users.
          </p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        {/* Navigation Tabs */}
        <div className="overflow-x-auto pb-2">
          <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" /> Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" /> Orders
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" /> Users
            </TabsTrigger>
            <TabsTrigger value="brands" className="flex items-center gap-2">
              <Tags className="h-4 w-4" /> Brands & Categories
            </TabsTrigger>
            <TabsTrigger value="coupons" className="flex items-center gap-2">
              <Ticket className="h-4 w-4" /> Coupons
            </TabsTrigger>
          </TabsList>
        </div>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          {/* Metrics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${data?.totalRevenue.toFixed(2)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Total Orders
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{data?.totalOrders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data?.totalProducts}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data?.totalUsers}</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Order ID
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Customer
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {data?.recentOrders.map((order) => (
                      <tr
                        key={order._id}
                        className="border-b transition-colors hover:bg-muted/50"
                      >
                        <td className="p-4 align-middle">
                          {order.orderNumber}
                        </td>
                        <td className="p-4 align-middle">
                          {order.user?.name || "Guest"}
                        </td>
                        <td className="p-4 align-middle">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              order.status === "delivered"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4 align-middle text-right">
                          ${order.totalPrice.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PRODUCTS TAB SKELETON */}
        <TabsContent value="products">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Product Management</CardTitle>
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium">
                Add Product
              </button>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Fetch and map your products here using
                api.get("/admin/products")
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ORDERS TAB SKELETON */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Fetch and map your orders here using api.get("/admin/orders")
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* USERS TAB SKELETON */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Fetch and map your users here using api.get("/admin/users")
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* BRANDS/CATEGORIES TAB SKELETON */}
        <TabsContent value="brands">
          <Card>
            <CardHeader>
              <CardTitle>Brands & Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Fetch and map your brands/categories here using
                api.get("/admin/brands") and api.get("/admin/categories")
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* COUPONS TAB SKELETON */}
        <TabsContent value="coupons">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Discount Coupons</CardTitle>
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium">
                Create Coupon
              </button>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Fetch and map your coupons here using api.get("/admin/coupons")
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
