"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronLeft, CreditCard, Loader2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { clearCart } from "@/store/slices/cartSlice";
import { cn, formatPrice } from "@/lib/utils";
import { toast } from "sonner";

import api from "@/lib/api";

export default function CheckoutPage() {
  const { items, totalPrice } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );
  const dispatch = useDispatch();
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi">("card");

  // Shipping Address States
  const [firstName, setFirstName] = useState(
    user?.name?.split(" ")[0] || "John",
  );
  const [lastName, setLastName] = useState(
    user?.name?.split(" ").slice(1).join(" ") || "Doe",
  );
  const [phone, setPhone] = useState("+1-234-567-8900");
  const [addressLine1, setAddressLine1] = useState("123 Luxury Avenue");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("New York");
  const [stateName, setStateName] = useState("NY");
  const [postalCode, setPostalCode] = useState("10001");
  const [country, setCountry] = useState("USA");

  const shipping = totalPrice > 150 ? 0 : 15;
  const tax = totalPrice * 0.08;
  const orderTotal = totalPrice + shipping + tax;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Authentication Required", {
        description: "Please sign in to place an order.",
      });
      router.push("/login?redirect=/checkout");
      return;
    }

    setIsLoading(true);

    try {
      // Map to backend schema
      const orderItems = items.map((item) => ({
        product: item.productId,
        name: item.name,
        image: item.image,
        brand: item.brand,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.price,
      }));

      const shippingAddress = {
        fullName: `${firstName} ${lastName}`.trim(),
        phone,
        addressLine1,
        addressLine2,
        city,
        state: stateName,
        postalCode,
        country,
      };

      const payload = {
        items: orderItems,
        shippingAddress,
        paymentMethod: paymentMethod === "card" ? "stripe" : "cod", // map 'upi' to 'cod' or handle cod
        itemsPrice: totalPrice,
        taxPrice: tax,
        shippingPrice: shipping,
        discountAmount: 0,
        totalPrice: orderTotal,
      };

      const response = await api.post("/orders", payload);

      setIsSuccess(true);
      dispatch(clearCart());

      toast.success("Order placed successfully!", {
        description: `Order ID: ${response.data.data.orderNumber}`,
      });
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Order placement failed. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-background max-w-md w-full rounded-3xl p-8 sm:p-12 text-center shadow-xl border border-border"
        >
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-4">
            Payment Successful!
          </h1>
          <p className="text-muted-foreground mb-8">
            Thank you for your purchase. Your order number is{" "}
            <strong>#BS-{Math.floor(Math.random() * 1000000)}</strong>.
          </p>
          <button
            onClick={() => router.push("/shop")}
            className="w-full h-12 bg-foreground text-background rounded-full font-semibold hover:bg-foreground/90 transition-colors"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Link
            href="/shop"
            className="text-[var(--brand-red)] font-medium hover:underline"
          >
            Go to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Checkout Header */}
      <header className="bg-background border-b h-16 flex items-center justify-center relative">
        <Link
          href="/cart"
          className="absolute left-4 sm:left-8 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Cart
        </Link>
        <Link href="/" className="font-bold text-xl tracking-tight">
          Brand Store
        </Link>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Checkout Form */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-background rounded-3xl p-6 sm:p-8 shadow-sm border border-border">
              <h2 className="text-xl font-bold mb-6">1. Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full h-11 px-4 rounded-lg border bg-muted/50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-red)]/50"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full h-11 px-4 rounded-lg border bg-muted/50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-red)]/50"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    className="w-full h-11 px-4 rounded-lg border bg-muted/50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-red)]/50"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    className="w-full h-11 px-4 rounded-lg border bg-muted/50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-red)]/50"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    type="text"
                    className="w-full h-11 px-4 rounded-lg border bg-muted/50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-red)]/50"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                  />
                </div>
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    City
                  </label>
                  <input
                    type="text"
                    className="w-full h-11 px-4 rounded-lg border bg-muted/50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-red)]/50"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    State / Province
                  </label>
                  <input
                    type="text"
                    className="w-full h-11 px-4 rounded-lg border bg-muted/50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-red)]/50"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    className="w-full h-11 px-4 rounded-lg border bg-muted/50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-red)]/50"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Country
                  </label>
                  <input
                    type="text"
                    className="w-full h-11 px-4 rounded-lg border bg-muted/50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-red)]/50"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-background rounded-3xl p-6 sm:p-8 shadow-sm border border-border">
              <h2 className="text-xl font-bold mb-6">2. Payment Method</h2>

              <div className="space-y-4 mb-6">
                {/* Credit Card Option */}
                <div
                  onClick={() => setPaymentMethod("card")}
                  className={cn(
                    "border rounded-xl p-4 flex items-start gap-3 cursor-pointer transition-all",
                    paymentMethod === "card"
                      ? "border-[var(--brand-red)] bg-[var(--brand-red)]/5"
                      : "border-border hover:bg-muted/30",
                  )}
                >
                  <input
                    type="radio"
                    id="card"
                    name="payment"
                    className="mt-1"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                  />
                  <div>
                    <label
                      htmlFor="card"
                      className="font-semibold block mb-1 cursor-pointer"
                    >
                      Credit / Debit Card
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Secure payment via Stripe
                    </p>
                  </div>
                  <CreditCard className="ml-auto h-5 w-5 text-muted-foreground" />
                </div>

                {/* UPI QR Code Option */}
                <div
                  onClick={() => setPaymentMethod("upi")}
                  className={cn(
                    "border rounded-xl p-4 flex items-start gap-3 cursor-pointer transition-all",
                    paymentMethod === "upi"
                      ? "border-[var(--brand-red)] bg-[var(--brand-red)]/5"
                      : "border-border hover:bg-muted/30",
                  )}
                >
                  <input
                    type="radio"
                    id="upi"
                    name="payment"
                    className="mt-1"
                    checked={paymentMethod === "upi"}
                    onChange={() => setPaymentMethod("upi")}
                  />
                  <div>
                    <label
                      htmlFor="upi"
                      className="font-semibold block mb-1 cursor-pointer"
                    >
                      UPI QR Code
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Scan with Google Pay, PhonePe, Paytm
                    </p>
                  </div>
                  <div className="ml-auto flex items-center h-5">
                    <svg
                      className="h-5 w-5 text-muted-foreground"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4 4h6v6H4V4zm2 2v2h2V6H6zm0 12v2h2v-2H6zM4 14h6v6H4v-6zm10-10h6v6h-6V4zm2 2v2h2V6h-2zm-2 10h2v2h-2v-2zm2-2h2v2h-2v-2zm2 4h2v2h-2v-2zm-4 2h2v-2h-2v2zm4-6h2v2h-2v-2zm-6-2h2v2h-2v-2zm2-2h2v2h-2v-2zm0-2h-2v2h2V8zm-2 4h-2v2h2v-2zm6-4h2V4h-2v4zm-2 6h2v-2h-2v2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <form onSubmit={handlePlaceOrder}>
                {paymentMethod === "card" ? (
                  <div className="space-y-4 mb-8">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Card Number
                      </label>
                      <input
                        type="text"
                        className="w-full h-11 px-4 rounded-lg border bg-muted/50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-red)]/50 font-mono"
                        placeholder="4242 4242 4242 4242"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Expiry (MM/YY)
                        </label>
                        <input
                          type="text"
                          className="w-full h-11 px-4 rounded-lg border bg-muted/50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-red)]/50 font-mono"
                          placeholder="12/26"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          CVC
                        </label>
                        <input
                          type="text"
                          className="w-full h-11 px-4 rounded-lg border bg-muted/50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-red)]/50 font-mono"
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-8 p-6 border rounded-2xl bg-muted/20 flex flex-col items-center text-center">
                    <h3 className="font-semibold text-sm mb-1 text-foreground">
                      Scan & Pay Yatharth RSS
                    </h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      Central Bank of India 3393
                    </p>

                    {/* Dynamic UPI QR Code Generation */}
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-border mb-4">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=5&data=${encodeURIComponent(
                          `upi://pay?pa=yatharthrss@okaxis&pn=yatharth%20rss&cu=INR&am=${orderTotal.toFixed(2)}`,
                        )}`}
                        alt="UPI Payment QR Code"
                        className="w-48 h-48"
                      />
                    </div>

                    <p className="text-sm font-bold text-[var(--brand-red)] mb-4">
                      Amount: {formatPrice(orderTotal)}
                    </p>

                    <div className="w-full max-w-xs flex flex-col gap-2">
                      <div className="flex items-center justify-between text-xs border rounded-lg p-2.5 bg-background">
                        <span className="font-mono text-muted-foreground">
                          yatharthrss@okaxis
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText("yatharthrss@okaxis");
                            toast.success("UPI ID Copied!");
                          }}
                          className="text-[var(--brand-red)] font-semibold hover:underline"
                        >
                          Copy
                        </button>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        Scan with Google Pay, PhonePe, Paytm, or any UPI app to
                        complete payment. Click below after completing transfer.
                      </p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-foreground text-background rounded-full font-semibold text-lg flex items-center justify-center hover:bg-foreground/90 transition-colors disabled:opacity-70"
                >
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : paymentMethod === "card" ? (
                    `Pay ${formatPrice(orderTotal)}`
                  ) : (
                    "I Have Paid - Place Order"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5">
            <div className="bg-background rounded-3xl p-6 sm:p-8 shadow-sm border border-border sticky top-8">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 no-scrollbar mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.color} / {item.size} / Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
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

              <div className="flex justify-between items-center py-4 border-t mt-6">
                <span className="text-base font-bold">Total</span>
                <span className="text-xl font-bold text-[var(--brand-red)]">
                  {formatPrice(orderTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
