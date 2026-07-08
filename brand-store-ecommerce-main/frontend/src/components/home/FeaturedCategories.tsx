'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '@/constants';

export default function FeaturedCategories() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--brand-red)] mb-2">
            Shop by Category
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Featured Categories</h2>
          <p className="text-muted-foreground mt-2">Every silhouette, engineered to last.</p>
        </motion.div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((category, i) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link
                href={`/category/${category.slug}`}
                className="group block"
              >
                <div className="relative aspect-[4/5] bg-[var(--brand-off-white)] dark:bg-muted rounded-2xl overflow-hidden mb-3 img-zoom">
                  {/* Overlay gradient for text readability if needed, or just slight darkening */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10" />
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{category.name}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-foreground transition-all" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
