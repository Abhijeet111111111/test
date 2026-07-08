'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'sonner';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Welcome to Brand Store!', {
      description: 'You\'ll get exclusive deals and early access to new drops.',
    });
    setEmail('');
  };

  return (
    <section className="py-20">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-foreground text-background p-12 sm:p-16 text-center"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--brand-red)]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--brand-red)]/5 rounded-full blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              Join the Brand Store community
            </h2>
            <p className="text-sm sm:text-base opacity-60 max-w-md mx-auto mb-8">
              Get early access to new arrivals, exclusive deals, and style inspiration delivered to your inbox.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 h-12 px-5 bg-background/10 border border-background/20 rounded-full text-sm text-background placeholder:text-background/40 focus:outline-none focus:ring-2 focus:ring-[var(--brand-red)]/50"
                required
              />
              <button
                type="submit"
                className="h-12 px-8 bg-[var(--brand-red)] text-white rounded-full text-sm font-semibold hover:bg-[var(--brand-red-dark)] transition-colors shrink-0"
              >
                Subscribe
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
