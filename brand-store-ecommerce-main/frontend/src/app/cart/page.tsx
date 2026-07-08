"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight, ShieldCheck } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  updateQuantity,
  removeFromCart,
  clearCart,
} from "@/store/slices/cartSlice";
import { cn, formatPrice } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";

export default function CartPage() {
  const dispatch = useDispatch();
  const { items, totalItems, totalPrice } = useSelector(
    (state: RootState) => state.cart,
  );

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantity({ id, quantity: newQuantity }));
  };

  const handleRemove = (id: string, name: string) => {
    dispatch(removeFromCart(id));
    toast.success("Item removed", { description: name });
  };

  const shipping = totalPrice > 150 ? 0 : 15;
  const tax = totalPrice * 0.08; // 8% tax
  const orderTotal = totalPrice + shipping + tax;

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 min-h-screen">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight mb-8">
            Shopping Bag
          </h1>

          {items.length === 0 ? (
            <div className="text-center py-20 bg-muted/20 rounded-3xl border border-border">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Your bag is empty</h2>
              <p className="text-muted-foreground mb-8">
                Looks like you haven&apos;t added any items yet.
              </p>
              <Link
                href="/shop"
                className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-8 text-sm font-semibold text-background hover:bg-foreground/90 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-12 items-start">
              {/* Cart Items List */}
              <div className="lg:col-span-8 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b">
                  <span className="text-sm font-medium">
                    {totalItems} {totalItems === 1 ? "Item" : "Items"}
                  </span>
                  <button
                    onClick={() => dispatch(clearCart())}
                    className="text-sm font-medium text-muted-foreground hover:text-destructive transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-6">
                  {items.map((item:any) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={item.id}
                      className="flex gap-4 sm:gap-6 pb-6 border-b"
                    >
                      {/* Image */}
                      <Link
                        href={`/product/${item.productId}`}
                        className="shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-muted rounded-xl overflow-hidden relative"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 96px, 128px"
                        />
                      </Link>

                      {/* Details */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1">
                              {item.brand.name}
                            </p>
                            <Link
                              href={`/product/${item.productId}`}
                              className="text-base sm:text-lg font-semibold hover:text-[var(--brand-red)] transition-colors line-clamp-2"
                            >
                              {item.name}
                            </Link>
                            <p className="text-sm text-muted-foreground mt-1">
                              Color:{" "}
                              <span className="font-medium text-foreground">
                                {item.color}
                              </span>{" "}
                              | Size:{" "}
                              <span className="font-medium text-foreground">
                                {item.size}
                              </span>
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-base sm:text-lg font-semibold">
                              {formatPrice(item.price)}
                            </p>
                            {item.compareAtPrice > 0 && (
                              <p className="text-sm text-muted-foreground line-through">
                                {formatPrice(item.compareAtPrice)}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-auto pt-4 flex items-center justify-between">
                          <div className="flex items-center h-9 bg-muted rounded-full px-1 border border-border">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity - 1)
                              }
                              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-background transition-colors text-muted-foreground hover:text-foreground"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-background transition-colors text-muted-foreground hover:text-foreground"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemove(item.id, item.name)}
                            className="text-sm font-medium text-muted-foreground hover:text-destructive underline underline-offset-4 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-4 bg-muted/30 rounded-3xl p-6 sm:p-8 border border-border sticky top-24">
                <h2 className="text-xl font-bold tracking-tight mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? "Free" : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Tax</span>
                    <span className="font-medium">{formatPrice(tax)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-4 border-t mb-6">
                  <span className="text-base font-bold">Total</span>
                  <span className="text-xl font-bold">
                    {formatPrice(orderTotal)}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="group flex w-full h-14 items-center justify-center gap-2 rounded-full bg-[var(--brand-red)] px-8 text-sm font-semibold tracking-wide text-white hover:bg-[var(--brand-red-dark)] transition-all hover:shadow-lg hover:shadow-[var(--brand-red)]/20 active:scale-[0.98]"
                >
                  CHECKOUT
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <div className="mt-6 pt-6 border-t flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Secure, SSL encrypted checkout</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
