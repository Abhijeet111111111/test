'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BRANDS, FOOTER_LINKS, SITE_CONFIG } from '@/constants';
import { toast } from 'sonner';

// Custom SVG Icons for social media
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.5 7.1C2.5 7.1 2 9.5 2 12c0 2.5.5 4.9.5 4.9 0 0 1.9 1.6 4.9 1.6 3 0 9.1 0 9.1 0s1.9-1.6 4.9-1.6c0 0 .5-2.4.5-4.9 0-2.5-.5-4.9-.5-4.9 0 0-1.9-1.6-4.9-1.6-3 0-9.1 0-9.1 0s-1.9 1.6-4.9 1.6z"/><polygon points="9.5 15.5 15.5 12 9.5 8.5 9.5 15.5"/>
  </svg>
);

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Thanks for subscribing!', {
      description: 'You\'ll receive our latest updates and deals.',
    });
    setEmail('');
  };

  return (
    <footer className="bg-background border-t">
      {/* Brand Marquee */}
      <div className="border-b overflow-hidden py-5">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...BRANDS, ...BRANDS].map((brand, i) => (
            <span
              key={`${brand.slug}-${i}`}
              className="mx-8 text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground/60 hover:text-foreground transition-colors cursor-pointer"
            >
              {brand.name}
            </span>
          ))}
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Info + Newsletter */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background font-bold text-sm">
                B
              </div>
              <span className="text-lg font-semibold tracking-tight">Brand Store</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Premium footwear from the world&apos;s most iconic brands. Curated, authenticated, delivered.
            </p>
            <form onSubmit={handleSubscribe} className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Join our newsletter"
                className="flex-1 h-10 px-4 text-sm bg-muted/50 border border-border rounded-l-lg focus:outline-none focus:ring-1 focus:ring-[var(--brand-red)]/30"
              />
              <button
                type="submit"
                className="h-10 px-5 text-sm font-semibold bg-foreground text-background rounded-r-lg hover:bg-foreground/90 transition-colors"
              >
                SUBSCRIBE
              </button>
            </form>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.15em] uppercase mb-4">Company</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.15em] uppercase mb-4">Support</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal + Social */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.15em] uppercase mb-4">Legal</h3>
            <ul className="space-y-3 mb-6">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            {SITE_CONFIG.copyright}
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Instagram"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Twitter"
            >
              <TwitterIcon className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Facebook"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="YouTube"
            >
              <YoutubeIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
