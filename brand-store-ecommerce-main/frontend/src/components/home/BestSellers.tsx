'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { SAMPLE_PRODUCTS } from '@/constants';
import { ProductCard } from './TrendingNow';

export default function BestSellers() {
  const bestSellers = SAMPLE_PRODUCTS.slice(4, 8);

  return (
    <section className="py-20 bg-muted/30">
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
              Most Popular
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Best Sellers</h2>
            <p className="text-muted-foreground mt-2">The shoes our customers can&apos;t stop buying.</p>
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
          {bestSellers.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
