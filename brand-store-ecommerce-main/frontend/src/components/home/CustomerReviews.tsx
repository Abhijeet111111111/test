'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { CUSTOMER_REVIEWS } from '@/constants';

export default function CustomerReviews() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--brand-red)] mb-2">
            Customer Stories
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">What people are saying</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CUSTOMER_REVIEWS.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-background border border-border rounded-2xl p-6 hover-lift"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-[var(--brand-red)] text-[var(--brand-red)]" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-foreground/80 leading-relaxed mb-6">
                &ldquo;{review.comment}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{review.name}</p>
                  <p className="text-xs text-muted-foreground">Verified buyer</p>
                </div>
                <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                  {review.brand}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
