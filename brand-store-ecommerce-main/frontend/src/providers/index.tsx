"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";
import { initializeCart } from "@/store/slices/cartSlice";
import { initializeWishlist } from "@/store/slices/wishlistSlice";
import AuthProvider from "./../components/providers/AuthProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function StoreInitializer() {
  useEffect(() => {
    store.dispatch(initializeCart());
    store.dispatch(initializeWishlist());
  }, []);
  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Provider store={store}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange={false}
          >
            <StoreInitializer />
            {children}
            {mounted && (
              <Toaster
                position="bottom-right"
                richColors
                closeButton
                toastOptions={{
                  style: {
                    fontFamily: "var(--font-inter)",
                  },
                }}
              />
            )}
          </ThemeProvider>
        </QueryClientProvider>
      </AuthProvider>
    </Provider>
  );
}
