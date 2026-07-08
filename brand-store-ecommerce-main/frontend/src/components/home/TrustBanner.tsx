'use client';

import { motion } from 'framer-motion';
import { Truck, ShieldCheck, RotateCcw, Sparkles } from 'lucide-react';
import { TRUST_BADGES } from '@/constants';

const iconMap: Record<string, React.ReactNode> = {
  Truck: <Truck className="h-4 w-4 text-[var(--brand-red)]" />,
  ShieldCheck: <ShieldCheck className="h-4 w-4 text-[var(--brand-red)]" />,
  RotateCcw: <RotateCcw className="h-4 w-4 text-[var(--brand-red)]" />,
  Sparkles: <Sparkles className="h-4 w-4 text-[var(--brand-red)]" />,
};

export default function TrustBanner() {
  return (
    <section className="border-b bg-muted/30">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-4">
          {TRUST_BADGES.map((badge, i) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex items-center justify-center gap-2.5 py-2"
            >
              {iconMap[badge.icon]}
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                {badge.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
