"use client";

import React, { useState, useEffect } from "react";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import { Product } from "@/lib/types";

import { motion } from "framer-motion";
import { notFound } from "next/navigation";

import {
  Star,
  Truck,
  ArrowLeft,
  Heart,
  ShieldCheck,
  Ruler,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { SAMPLE_PRODUCTS, CUSTOMER_REVIEWS } from "@/constants";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ProductCard } from "@/components/home/TrendingNow";
import { cn, formatPrice, slugify } from "@/lib/utils";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import { toggleWishlistItem } from "@/store/slices/wishlistSlice";
import { RootState } from "@/store";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Use a mock Accordion component here for simplicity, or we can use normal details/summary since we didn't install shadcn accordion.
// Actually, let's just use plain accessible HTML for accordion to avoid missing dependencies.

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);
  const [product, setProduct] = useState<Product | null>(null);

  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  // const product = SAMPLE_PRODUCTS.find((p) => p.slug === slug);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  // const isWishlisted = product ? wishlistItems.includes(product.id) : false;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      let p = await getProductBySlug(slug);
      // console.log("********", p);
      if (cancelled) return;
      
      if (!p) {
        setNotFoundFlag(true);
        setLoading(false);
        return;
      }
      
      console.log(p);
      setProduct(p);
      setSelectedSize(p.sizes[0].size ?? "");
      setSelectedColor(p.colors[0].name ?? "");

      const related = await getRelatedProducts(p.id, 4);
      if (!cancelled) setRelatedProducts(related);

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
  if (loading || !product) {
    return <div className="pt-24 text-center">Loading...</div>;
  }

  const isWishlisted = wishlistItems.includes(product.id);

  // Auto-select first options if not selected
  if (!selectedSize && product.sizes.length > 0)
    setSelectedSize(product.sizes[0].size);
  if (!selectedColor && product.colors.length > 0)
    setSelectedColor(product.colors[0].name);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select size and color");
      return;
    }
    dispatch(
      addToCart({
        id: "", // Will be generated in slice
        productId: product.id,
        name: product.name,
        brand: product.brand.name,
        image: product.images[0],
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        size: selectedSize,
        color: selectedColor,
        quantity,
      }),
    );
    toast.success("Added to bag", {
      description: `${product.name} - ${selectedColor}, Size ${selectedSize}`,
    });
  };

  const handleWishlist = () => {
    dispatch(toggleWishlistItem(product.id));
    toast(isWishlisted ? "Removed from wishlist" : "Added to wishlist", {
      description: product.name,
    });
  };

  const mockImages = product.images;
  console.log(mockImages);

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/shop"
              className="hover:text-foreground transition-colors"
            >
              Shop
            </Link>
            <span>/</span>
            <Link
              href={`/category/${product.category.slug}`}
              className="hover:text-foreground transition-colors"
            >
              {product.category.name}
            </Link>
            <span>/</span>
            <span className="text-foreground truncate">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 mb-24">
            {/* Gallery */}
            <div className="flex flex-col-reverse md:flex-row gap-4">
              {/* Thumbnails */}
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible no-scrollbar pb-2 md:pb-0">
                {mockImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      "relative w-20 h-24 shrink-0 rounded-xl overflow-hidden bg-muted transition-all",
                      activeImage === i
                        ? "ring-2 ring-[var(--brand-red)]"
                        : "hover:opacity-80",
                    )}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${i}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="relative flex-1 aspect-[4/5] bg-muted rounded-3xl overflow-hidden">
                <div className="absolute top-4 left-4 z-10">
                  {product.badge && (
                    <span className="px-3 py-1.5 text-xs font-bold tracking-wider uppercase rounded-full bg-foreground text-background">
                      {product.badge}
                    </span>
                  )}
                </div>
                <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                  <button
                    onClick={handleWishlist}
                    className="p-3 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-md hover:bg-white dark:hover:bg-black/60 transition-all shadow-sm"
                  >
                    <Heart
                      className={cn(
                        "h-5 w-5 transition-colors",
                        isWishlisted
                          ? "fill-[var(--brand-red)] text-[var(--brand-red)]"
                          : "text-foreground",
                      )}
                    />
                  </button>
                  <button className="p-3 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-md hover:bg-white dark:hover:bg-black/60 transition-all shadow-sm">
                    <Share2 className="h-5 w-5 text-foreground" />
                  </button>
                </div>

                <Image
                  src={mockImages[activeImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
              <div className="mb-6">
                <p className="text-sm font-bold tracking-[0.2em] uppercase text-muted-foreground mb-2">
                  {product.brand.name}
                </p>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">
                      {product.rating}
                    </span>
                  </div>
                  <a
                    href="#reviews"
                    className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
                  >
                    Read {product.numReviews} Reviews
                  </a>
                </div>
                <div className="flex items-end gap-3">
                  <span className="text-3xl font-bold">
                    {formatPrice(product.price)}
                  </span>
                  {product.compareAtPrice > 0 && (
                    <span className="text-lg text-muted-foreground line-through mb-1">
                      {formatPrice(product.compareAtPrice)}
                    </span>
                  )}
                </div>
              </div>

              <div className="prose prose-sm dark:prose-invert mb-8 text-muted-foreground">
                <p>
                  Engineered for premium comfort and timeless style. The{" "}
                  {product.name} features an advanced cushioning system and
                  sustainable materials, perfect for all-day wear without
                  compromising on aesthetics.
                </p>
              </div>

              {/* Color Selection */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">
                    Color:{" "}
                    <span className="text-muted-foreground font-normal ml-1">
                      {selectedColor}
                    </span>
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => {
                    console.log(color);
                    return (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={cn(
                          "w-10 h-10 rounded-full border-2 transition-all",
                          selectedColor === color.name
                            ? "border-[var(--brand-red)] scale-110"
                            : "border-transparent hover:scale-105",
                        )}
                        style={{
                          backgroundColor:
                            color.name.toLowerCase() === "white"
                              ? "#f5f5f5"
                              : color.name.toLowerCase() === "black"
                                ? "#111"
                                : color.name.toLowerCase(),
                        }}
                      >
                        <span className="sr-only">{color.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">Size</h3>
                  <button className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                    <Ruler className="h-3 w-3" /> Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size.size}
                      onClick={() => setSelectedSize(size.size)}
                      className={cn(
                        "h-12 rounded-xl text-sm font-semibold border transition-all",
                        selectedSize === size
                          ? "bg-foreground text-background border-foreground shadow-md"
                          : "border-border hover:border-foreground/30 hover:bg-accent",
                      )}
                    >
                      {size.size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add to Cart Actions */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center h-14 bg-muted rounded-full px-2 border border-border">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-background transition-colors text-lg"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-background transition-colors text-lg"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 h-14 bg-[var(--brand-red)] text-white rounded-full font-semibold tracking-wide hover:bg-[var(--brand-red-dark)] transition-all hover:shadow-lg hover:shadow-[var(--brand-red)]/20 active:scale-[0.98]"
                >
                  ADD TO BAG
                </button>
              </div>

              {/* Service Badges */}
              <div className="grid grid-cols-2 gap-4 py-6 border-y border-border mb-8">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Free Shipping</p>
                    <p className="text-xs text-muted-foreground">
                      On orders over $150
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Authenticity</p>
                    <p className="text-xs text-muted-foreground">
                      100% Guaranteed
                    </p>
                  </div>
                </div>
              </div>

              {/* Details Accordion (Native) */}
              <div className="space-y-4">
                <details className="group border-b pb-4">
                  <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold marker:content-none">
                    Product Details
                    <span className="transition group-open:rotate-180">
                      <svg
                        fill="none"
                        height="24"
                        shapeRendering="geometricPrecision"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        width="24"
                      >
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </summary>
                  <div className="mt-4 text-sm text-muted-foreground space-y-2">
                    <p>
                      Designed with meticulous attention to detail, featuring:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Premium full-grain leather upper</li>
                      <li>Responsive EVA midsole for all-day comfort</li>
                      <li>Durable rubber outsole for enhanced traction</li>
                      <li>Breathable mesh lining</li>
                    </ul>
                  </div>
                </details>
                <details className="group border-b pb-4">
                  <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold marker:content-none">
                    Shipping & Returns
                    <span className="transition group-open:rotate-180">
                      <svg
                        fill="none"
                        height="24"
                        shapeRendering="geometricPrecision"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        width="24"
                      >
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </summary>
                  <div className="mt-4 text-sm text-muted-foreground space-y-2">
                    <p>
                      <strong>Shipping:</strong> Standard shipping is free on
                      all orders over $150. Orders are typically processed and
                      shipped within 1-2 business days.
                    </p>
                    <p>
                      <strong>Returns:</strong> We accept returns within 30 days
                      of delivery. Items must be unworn and in their original
                      packaging.
                    </p>
                  </div>
                </details>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <div className="pt-16 border-t">
            <h2 className="text-2xl font-bold tracking-tight mb-8">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {SAMPLE_PRODUCTS.filter((p) => p.id !== product.id)
                .slice(0, 4)
                .map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
