"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, X, Grid3X3, LayoutGrid } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ProductCard } from "@/components/home/TrendingNow";

import { getProductsByCategory } from "@/lib/products";
import { getCategoryBySlug } from "@/lib/categories";
import { Product, Category } from "@/lib/types";

import { BRANDS, SORT_OPTIONS, SHOE_SIZES, SHOE_COLORS } from "@/constants";
import { cn, formatPrice } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { notFound } from "next/navigation";
import Image from "next/image";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const DEFAULT_HEADER_IMAGE =
  "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop";

export default function CategoryPage({ params }: PageProps) {
  const { slug } = React.use(params);

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  const [sortBy, setSortBy] = useState("-createdAt");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [gridCols, setGridCols] = useState<3 | 4>(4);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);

      const cat = await getCategoryBySlug(slug);
      if (cancelled) return;

      if (!cat) {
        setNotFoundFlag(true);
        setLoading(false);
        return;
      }

      setCategory(cat);

      const prods = await getProductsByCategory(cat.id);
      if (cancelled) return;

      setProducts(prods);
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (notFoundFlag) {
    notFound();
  }

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedBrands.length > 0) {
      list = list.filter((p:any) => selectedBrands.includes(p.brand.name));
    }
    if (selectedSizes.length > 0) {
      list = list.filter((p:any) =>
        p.sizes.some((s:any) => selectedSizes.includes(s.size)),
      );
    }
    list = list.filter(
      (p:any) => p.price >= priceRange[0] && p.price <= priceRange[1],
    );

    switch (sortBy) {
      case "price":
        list.sort((a, b) => a.price - b.price);
        break;
      case "-price":
        list.sort((a, b) => b.price - a.price);
        break;
      case "-rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "-numReviews":
        list.sort((a, b) => b.numReviews - a.numReviews);
        break;
      default:
        break;
    }

    return list;
  }, [selectedBrands, selectedSizes, priceRange, sortBy, products]);

  const activeFilterCount =
    selectedBrands.length +
    selectedSizes.length +
    selectedColors.length +
    (priceRange[0] > 0 || priceRange[1] < 50000 ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange([0, 50000]);
  };

  const toggleArrayItem = (
    arr: string[],
    item: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setter(arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {activeFilterCount > 0 && (
        <button
          onClick={clearAllFilters}
          className="text-xs font-medium text-[var(--brand-red)] hover:underline"
        >
          Clear all filters ({activeFilterCount})
        </button>
      )}

      <div>
        <h3 className="text-sm font-semibold mb-3">Brand</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {BRANDS.map((brand) => (
            <div key={brand.slug} className="flex items-center gap-2">
              <Checkbox
                id={`brand-${brand.slug}`}
                checked={selectedBrands.includes(brand.name)}
                onCheckedChange={() =>
                  toggleArrayItem(selectedBrands, brand.name, setSelectedBrands)
                }
              />
              <Label
                htmlFor={`brand-${brand.slug}`}
                className="text-sm text-muted-foreground cursor-pointer"
              >
                {brand.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-sm font-semibold mb-3">Price Range</h3>
        <Slider
          value={priceRange}
          onValueChange={(val) => setPriceRange(val as number[])}
          max={50000}
          min={0}
          step={1000}
          className="mb-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-sm font-semibold mb-3">Size</h3>
        <div className="grid grid-cols-4 gap-2">
          {SHOE_SIZES.map((size) => (
            <button
              key={size}
              onClick={() =>
                toggleArrayItem(selectedSizes, size, setSelectedSizes)
              }
              className={cn(
                "h-9 rounded-lg text-xs font-medium border transition-colors",
                selectedSizes.includes(size)
                  ? "bg-foreground text-background border-foreground"
                  : "border-border hover:border-foreground/30",
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-sm font-semibold mb-3">Color</h3>
        <div className="flex flex-wrap gap-2">
          {SHOE_COLORS.map((color) => (
            <button
              key={color.name}
              onClick={() =>
                toggleArrayItem(selectedColors, color.name, setSelectedColors)
              }
              className={cn(
                "w-8 h-8 rounded-full border-2 transition-all",
                selectedColors.includes(color.name)
                  ? "border-[var(--brand-red)] scale-110"
                  : "border-transparent hover:scale-105",
              )}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            >
              {color.hex === "#FFFFFF" && (
                <span className="block w-full h-full rounded-full border border-border" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading || !category) {
    return <div className="pt-24 text-center">Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <div className="relative h-[280px] w-full overflow-hidden flex items-center">
          <div className="absolute inset-0 z-0">
            <Image
              src={category.image || DEFAULT_HEADER_IMAGE}
              alt={category.name}
              fill
              className="object-cover brightness-[0.4]"
              priority
            />
          </div>
          <div className="relative z-10 mx-auto max-w-[1400px] w-full px-4 sm:px-6 lg:px-8 text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              <nav className="flex items-center gap-2 text-xs font-medium text-white/70 mb-4">
                <a href="/" className="hover:text-white transition-colors">
                  Home
                </a>
                <span>/</span>
                <a href="/shop" className="hover:text-white transition-colors">
                  Shop
                </a>
                <span>/</span>
                <span className="text-white">{category.name}</span>
              </nav>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
                {category.name}
              </h1>
              <p className="text-white/80 text-sm sm:text-base font-normal">
                {category.description}
              </p>
            </motion.div>
          </div>
        </div>

        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24">
                <h2 className="text-sm font-semibold mb-6">Filters</h2>
                <FilterContent />
              </div>
            </aside>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-6 gap-4">
                <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
                  <SheetTrigger
                    render={
                      <button className="lg:hidden flex items-center gap-2 h-10 px-4 border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors" />
                    }
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-1 h-5 px-1.5 text-[10px]"
                      >
                        {activeFilterCount}
                      </Badge>
                    )}
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>

                <div className="hidden lg:flex items-center gap-2 flex-wrap flex-1">
                  {selectedBrands.map((brand) => (
                    <Badge
                      key={brand}
                      variant="secondary"
                      className="gap-1 pr-1"
                    >
                      {brand}
                      <button
                        onClick={() =>
                          toggleArrayItem(
                            selectedBrands,
                            brand,
                            setSelectedBrands,
                          )
                        }
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {selectedSizes.map((size) => (
                    <Badge
                      key={size}
                      variant="secondary"
                      className="gap-1 pr-1"
                    >
                      Size {size}
                      <button
                        onClick={() =>
                          toggleArrayItem(selectedSizes, size, setSelectedSizes)
                        }
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-3 ml-auto">
                  <Select
                    value={sortBy}
                    onValueChange={(val) => val && setSortBy(val)}
                  >
                    <SelectTrigger className="w-44 h-10 text-sm">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {SORT_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="hidden sm:flex items-center border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setGridCols(3)}
                      className={cn(
                        "p-2 transition-colors",
                        gridCols === 3 ? "bg-accent" : "hover:bg-accent/50",
                      )}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setGridCols(4)}
                      className={cn(
                        "p-2 transition-colors",
                        gridCols === 4 ? "bg-accent" : "hover:bg-accent/50",
                      )}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div
                className={cn(
                  "grid gap-4 lg:gap-6",
                  gridCols === 3
                    ? "grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-2 lg:grid-cols-4",
                )}
              >
                {filteredProducts.map((product, i) => {
                  console.log("filtered", product);
                  return (
                    <ProductCard key={product.id} product={product} index={i} />
                  );
                })}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-lg font-medium text-muted-foreground">
                    No products found
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Try adjusting your filters
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="mt-4 text-sm font-medium text-[var(--brand-red)] hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
