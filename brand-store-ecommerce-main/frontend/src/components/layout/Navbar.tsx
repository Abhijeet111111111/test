"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
  Package,
  Settings,
  MapPin,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { toggleSearch, setMobileMenuOpen } from "@/store/slices/uiSlice";
import { NAV_LINKS } from "@/constants";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import SearchOverlay from "./SearchOverlay";
import { logout } from "@/store/slices/authSlice";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch();
  const cartCount = useSelector((state: RootState) => state.cart.totalItems);
  const wishlistCount = useSelector((state: RootState) => state.wishlist.count);
  const searchOpen = useSelector((state: RootState) => state.ui.searchOpen);
  const mobileMenuOpen = useSelector(
    (state: RootState) => state.ui.mobileMenuOpen,
  );
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  const dispatchAuth = useDispatch();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine if hero is dark (home page) to use light text
  const isHomePage = pathname === "/";
  const isTransparent = isHomePage && !scrolled;

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "glass shadow-sm"
            : isHomePage
              ? "bg-transparent"
              : "bg-background",
        )}
      >
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg font-bold text-sm transition-colors",
                  isTransparent
                    ? "bg-white text-black"
                    : "bg-foreground text-background",
                )}
              >
                B
              </div>
              <span
                className={cn(
                  "text-lg font-semibold tracking-tight transition-colors",
                  isTransparent ? "text-white" : "text-foreground",
                )}
              >
                Brand Store
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium transition-colors rounded-md",
                    isTransparent
                      ? "text-white/80 hover:text-white"
                      : "text-muted-foreground hover:text-foreground",
                    pathname === link.href &&
                      (isTransparent ? "text-white" : "text-foreground"),
                  )}
                >
                  {link.label}
                  {pathname === link.href && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-[var(--brand-red)]"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <button
                onClick={() => dispatch(toggleSearch())}
                className={cn(
                  "relative p-2 rounded-full transition-colors",
                  isTransparent
                    ? "text-white/80 hover:text-white hover:bg-white/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
                )}
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className={cn(
                  "relative p-2 rounded-full transition-colors",
                  isTransparent
                    ? "text-white/80 hover:text-white hover:bg-white/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
                )}
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--brand-red)] text-[10px] font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className={cn(
                  "relative p-2 rounded-full transition-colors",
                  isTransparent
                    ? "text-white/80 hover:text-white hover:bg-white/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
                )}
                aria-label="Cart"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--brand-red)] text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Theme Toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className={cn(
                    "p-2 rounded-full transition-colors hidden sm:flex",
                    isTransparent
                      ? "text-white/80 hover:text-white hover:bg-white/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  )}
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </button>
              )}

              {/* User Menu */}
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={cn(
                    "p-2 rounded-full transition-colors hidden sm:flex outline-none items-center gap-1.5",
                    isTransparent
                      ? "text-white/80 hover:text-white hover:bg-white/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  )}
                  aria-label="User menu"
                >
                  {isAuthenticated ? (
                    <span
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold",
                        isTransparent
                          ? "bg-white text-black"
                          : "bg-foreground text-background",
                      )}
                    >
                      {user?.name?.[0]?.toUpperCase() ?? "U"}
                    </span>
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {isAuthenticated ? (
                    <>
                      <div className="px-2 py-1.5 text-sm font-medium truncate">
                        {user?.name}
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        render={
                          <Link
                            href="/dashboard/orders"
                            className="flex items-center gap-2"
                          />
                        }
                      >
                        <Package className="h-4 w-4" /> My Orders
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        render={
                          <Link
                            href="/dashboard/addresses"
                            className="flex items-center gap-2"
                          />
                        }
                      >
                        <MapPin className="h-4 w-4" /> Addresses
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        render={
                          <Link
                            href="/dashboard/profile"
                            className="flex items-center gap-2"
                          />
                        }
                      >
                        <Settings className="h-4 w-4" /> Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => dispatch(logout())}
                        className="flex items-center gap-2 text-[var(--brand-red)]"
                      >
                        <LogOut className="h-4 w-4" /> Log Out
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem
                      render={
                        <Link
                          href="/login"
                          className="flex items-center gap-2"
                        />
                      }
                    >
                      <User className="h-4 w-4" /> Sign In
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              {/* Mobile Menu */}

              <Sheet
                open={mobileMenuOpen}
                onOpenChange={(open) => dispatch(setMobileMenuOpen(open))}
              >
                <SheetTrigger
                  render={
                    <button
                      className={cn(
                        "p-2 rounded-full transition-colors md:hidden",
                        isTransparent
                          ? "text-white/80 hover:text-white hover:bg-white/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent",
                      )}
                      aria-label="Menu"
                    />
                  }
                >
                  <Menu className="h-5 w-5" />
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-0">
                  <SheetHeader className="p-6 border-b">
                    <SheetTitle className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background font-bold text-sm">
                        B
                      </div>
                      Brand Store
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col py-4">
                    {NAV_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => dispatch(setMobileMenuOpen(false))}
                        className={cn(
                          "px-6 py-3 text-sm font-medium transition-colors hover:bg-accent",
                          pathname === link.href
                            ? "text-foreground bg-accent"
                            : "text-muted-foreground",
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                    <div className="border-t my-2" />
                    {isAuthenticated ? (
                      <>
                        <div className="px-6 py-3 text-sm font-medium">
                          {user?.name}
                        </div>
                        <button
                          onClick={() => {
                            dispatch(logout());
                            dispatch(setMobileMenuOpen(false));
                          }}
                          className="px-6 py-3 text-sm font-medium text-[var(--brand-red)] hover:bg-accent flex items-center gap-2 text-left"
                        >
                          <LogOut className="h-4 w-4" /> Log Out
                        </button>
                      </>
                    ) : (
                      <Link
                        href="/login"
                        onClick={() => dispatch(setMobileMenuOpen(false))}
                        className="px-6 py-3 text-sm font-medium text-muted-foreground hover:bg-accent flex items-center gap-2"
                      >
                        <User className="h-4 w-4" /> Sign In
                      </Link>
                    )}
                    <Link
                      href="/wishlist"
                      onClick={() => dispatch(setMobileMenuOpen(false))}
                      className="px-6 py-3 text-sm font-medium text-muted-foreground hover:bg-accent flex items-center gap-2"
                    >
                      <Heart className="h-4 w-4" /> Wishlist
                      {wishlistCount > 0 && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {wishlistCount}
                        </Badge>
                      )}
                    </Link>
                    {mounted && (
                      <button
                        onClick={() =>
                          setTheme(theme === "dark" ? "light" : "dark")
                        }
                        className="px-6 py-3 text-sm font-medium text-muted-foreground hover:bg-accent flex items-center gap-2 text-left"
                      >
                        {theme === "dark" ? (
                          <>
                            <Sun className="h-4 w-4" /> Light Mode
                          </>
                        ) : (
                          <>
                            <Moon className="h-4 w-4" /> Dark Mode
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Search Overlay */}
      <AnimatePresence>{searchOpen && <SearchOverlay />}</AnimatePresence>
    </>
  );
}
