"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { SAMPLE_PRODUCTS } from "@/constants";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { toggleWishlistItem } from "@/store/slices/wishlistSlice";
import { cn, formatPrice, getDiscountPercentage } from "@/lib/utils";
import { toast } from "sonner";
import Image from "next/image";

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  price: number;
  compareAtPrice: number;
  rating: number;
  numReviews: number;
  image: string;
  badge?: string;
  colors: readonly string[] | string[];
  sizes: readonly string[] | string[];
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  console.log("PRODUCTCARD", product);
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const isWishlisted = wishlistItems.includes(product.id);
  const discount = getDiscountPercentage(product.price, product.compareAtPrice);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(toggleWishlistItem(product.id));
    toast(isWishlisted ? "Removed from wishlist" : "Added to wishlist", {
      description: product.name,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group flex flex-col"
    >
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-[4/5] bg-muted rounded-2xl overflow-hidden mb-4"
      >
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {product.badge && (
            <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded-full bg-foreground text-background">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded-full bg-[var(--brand-red)] text-white">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-colors",
              isWishlisted
                ? "fill-[var(--brand-red)] text-[var(--brand-red)]"
                : "text-foreground",
            )}
          />
        </button>

        {/* Image */}
        <div className="absolute inset-0 bg-gradient-to-br from-muted-foreground/10 to-muted-foreground/20" />
        <Image
          src={product.images && product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 300px"
        />

        {/* Quick Add overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button className="w-full bg-background/90 backdrop-blur-md text-foreground font-semibold py-3 rounded-xl shadow-lg hover:bg-foreground hover:text-background transition-colors text-sm">
            Quick View
          </button>
        </div>
      </Link>

      {/* Product Info */}
      <div className="space-y-1">
        <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-muted-foreground">
          {product.brand.name}
        </p>
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/product/${product.slug}`}
            className="text-sm font-medium group-hover:text-[var(--brand-red)] transition-colors line-clamp-1 flex-1"
          >
            {product.name}
          </Link>
          <div className="text-right shrink-0">
            <span className="text-sm font-semibold">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice > 0 && (
              <span className="block text-xs text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs text-muted-foreground">
            {product.rating} · {product.numReviews}
          </span>
          {discount > 0 && (
            <span className="text-xs font-medium text-[var(--brand-red)] ml-auto">
              {discount}% OFF
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function TrendingNow() {
  const trendingProducts = SAMPLE_PRODUCTS.slice(0, 4);

  return (
    <section className="py-20 border-t">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--brand-red)] mb-2">
              Fresh on the Shelves
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Trending Now
            </h2>
            <p className="text-muted-foreground mt-2">
              The pairs everyone is lacing up this week.
            </p>
          </motion.div>
          <Link
            href="/shop?sort=-numReviews"
            className="text-sm font-medium hover:text-[var(--brand-red)] transition-colors hidden sm:block"
          >
            View all
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {trendingProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
