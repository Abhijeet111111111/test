'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, X, TrendingUp } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setSearchOpen } from '@/store/slices/uiSlice';
import Link from 'next/link';
import { SAMPLE_PRODUCTS } from '@/constants';

export default function SearchOverlay() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof SAMPLE_PRODUCTS[number][]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    inputRef.current?.focus();
    // Close on escape
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dispatch(setSearchOpen(false));
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [dispatch]);

  useEffect(() => {
    if (query.length > 1) {
      const filtered = SAMPLE_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  const trendingSearches = ['Sneakers', 'Chelsea Boots', 'Adidas', 'Running Shoes', 'Prada'];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-3xl px-4 pt-24">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for shoes, brands, categories..."
            className="w-full h-14 pl-12 pr-12 text-lg bg-muted/50 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-red)]/30 focus:border-[var(--brand-red)]/50 transition-all"
          />
          <button
            onClick={() => dispatch(setSearchOpen(false))}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-accent transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Trending Searches */}
        {!query && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-8"
          >
            <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Trending Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-4 py-2 text-sm bg-muted/50 border border-border rounded-full hover:bg-accent transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Search Results */}
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 space-y-2"
          >
            {results.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                onClick={() => dispatch(setSearchOpen(false))}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
              >
                <div className="h-14 w-14 bg-muted rounded-lg flex items-center justify-center text-xs text-muted-foreground">
                  IMG
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">{product.brand}</p>
                  <p className="text-sm font-medium truncate group-hover:text-[var(--brand-red)] transition-colors">
                    {product.name}
                  </p>
                </div>
                <p className="text-sm font-semibold">${product.price}</p>
              </Link>
            ))}
          </motion.div>
        )}

        {query.length > 1 && results.length === 0 && (
          <div className="mt-12 text-center text-muted-foreground">
            <p className="text-lg">No results found for &ldquo;{query}&rdquo;</p>
            <p className="text-sm mt-1">Try searching for a different term</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
