'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function HeroSection() {
  return (
    <section className="relative min-h-[100vh] bg-[#0a0a0a] overflow-hidden flex items-center">
      {/* Background gradient effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-[#1a0a0a]/40 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-[40%] bg-gradient-to-t from-[#0a0a0a] to-transparent" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 w-full py-32 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Collection badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-white/60 tracking-[0.15em] uppercase">
                <span className="text-[var(--brand-red)]">✦</span>
                Fall / Winter 2026 Collection
              </span>
            </motion.div>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[0.95] tracking-tight">
                Step Into{' '}
                <span className="font-[var(--font-playfair)] italic text-[var(--brand-red)]" style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif' }}>
                  Style.
                </span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-white/50 text-base sm:text-lg max-w-md leading-relaxed"
            >
              Premium footwear from the world&apos;s top brands. Curated for the ones who measure a day by the miles their shoes will carry them.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 h-12 px-8 bg-[var(--brand-red)] text-white rounded-full text-sm font-semibold tracking-wide hover:bg-[var(--brand-red-dark)] transition-all hover:shadow-lg hover:shadow-[var(--brand-red)]/20"
              >
                SHOP NOW
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 h-12 px-8 border border-white/20 text-white rounded-full text-sm font-semibold tracking-wide hover:bg-white/5 transition-all"
              >
                EXPLORE COLLECTION
              </Link>
            </motion.div>

            {/* Brand Strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-wrap gap-x-6 gap-y-2 pt-4"
            >
              {['ADIDAS', 'NEW BALANCE', 'PRADA', 'COLE HAAN', 'REEBOK'].map((brand) => (
                <span
                  key={brand}
                  className="text-[11px] tracking-[0.2em] text-white/25 hover:text-white/50 transition-colors cursor-pointer"
                >
                  {brand}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right — Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            {/* Main hero image */}
            <div className="relative aspect-square max-w-[560px] ml-auto">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-white/5 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop"
                  alt="Aster Noir Edition Sneaker"
                  fill
                  priority
                  className="object-cover opacity-90 mix-blend-lighten"
                  sizes="(max-width: 1024px) 100vw, 500px"
                />
              </div>

              {/* Floating Rating Badge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="absolute -top-2 -right-2 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 text-white"
              >
                <p className="text-[10px] uppercase tracking-[0.15em] text-white/50 mb-1">Rated</p>
                <div className="flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold">4.9</span>
                  <span className="text-xs text-white/40">· 12k reviews</span>
                </div>
              </motion.div>

              {/* Featured Product Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="absolute bottom-6 left-0 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-3 text-white"
              >
                <p className="text-[10px] uppercase tracking-[0.15em] text-white/50 mb-1">Featured</p>
                <p className="text-sm font-medium">Aster Noir Edition</p>
                <p className="text-[var(--brand-red)] font-semibold text-sm">{formatPrice(19999)}</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
