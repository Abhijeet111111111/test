'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { BRANDS } from '@/constants';

export default function FeaturedBrands() {
  return (
    <section className="py-20 border-t">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--brand-red)] mb-2">
            Our Partners
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Featured Brands</h2>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            We partner with the world&apos;s finest to bring you authenticated luxury.
          </p>
        </motion.div>

        {/* Brands Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {BRANDS.map((brand, i) => (
            <motion.div
              key={brand.slug}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <Link
                href={`/shop?brand=${brand.slug}`}
                className="flex items-center justify-center h-20 border border-border/50 rounded-xl hover:border-[var(--brand-red)]/30 hover:bg-[var(--brand-red)]/5 transition-all group"
              >
                <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground group-hover:text-foreground transition-colors text-center px-2">
                  {brand.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
