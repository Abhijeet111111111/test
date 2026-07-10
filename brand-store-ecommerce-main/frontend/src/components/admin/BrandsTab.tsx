"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  LayoutDashboard,
  Package,
  Tags,
  FolderTree,
  ShoppingBag,
  Users,
  Ticket,
} from "lucide-react";
import { RootState } from "@/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OverviewTab from "@/components/admin/OverviewTab";
import ProductsTab from "@/components/admin/ProductsTab";
import BrandsTab from "@/components/admin/BrandsTab";
import CategoriesTab from "@/components/admin/CategoriesTab";
import OrdersTab from "@/components/admin/OrdersTab";
import UsersTab from "@/components/admin/UsersTab";
import CouponsTab from "@/components/admin/CouponsTab";

const TABS = [
  { value: "overview", label: "Overview", icon: LayoutDashboard },
  { value: "products", label: "Products", icon: Package },
  { value: "brands", label: "Brands", icon: Tags },
  { value: "categories", label: "Categories", icon: FolderTree },
  { value: "orders", label: "Orders", icon: ShoppingBag },
  { value: "users", label: "Users", icon: Users },
  { value: "coupons", label: "Coupons", icon: Ticket },
] as const;

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Give the auth provider a tick to hydrate the user from localStorage
    // before deciding whether to bounce this visitor away.
    const timer = setTimeout(() => setChecked(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!checked) return;
    if (!isAuthenticated || user?.role !== "admin") {
      router.replace("/login");
    }
  }, [checked, isAuthenticated, user, router]);

  if (!checked || !isAuthenticated || user?.role !== "admin") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center pt-16">
        <p className="text-sm text-muted-foreground">Checking access…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Admin dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage products, brands, categories, orders, users and coupons.
        </p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-6 flex h-auto w-full flex-wrap justify-start gap-1 bg-transparent p-0">
          {TABS.map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="gap-1.5 data-[state=active]:bg-foreground data-[state=active]:text-background"
            >
              <Icon className="h-4 w-4" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab />
        </TabsContent>
        <TabsContent value="products">
          <ProductsTab />
        </TabsContent>
        <TabsContent value="brands">
          <BrandsTab />
        </TabsContent>
        <TabsContent value="categories">
          <CategoriesTab />
        </TabsContent>
        <TabsContent value="orders">
          <OrdersTab />
        </TabsContent>
        <TabsContent value="users">
          <UsersTab />
        </TabsContent>
        <TabsContent value="coupons">
          <CouponsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
