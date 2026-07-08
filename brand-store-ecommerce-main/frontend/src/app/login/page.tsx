'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Lock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/slices/authSlice';

import api from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;
      
      dispatch(setCredentials({ user, token }));

      toast.success('Welcome back!');
      router.push('/');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Invalid email or password';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-background to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-background rounded-3xl shadow-xl border border-border p-8 sm:p-10">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background font-bold mb-6">
              B
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Sign in to your account</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and password to access your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[var(--brand-red)]/50 focus:border-[var(--brand-red)] transition-all"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium" htmlFor="password">Password</label>
                <Link href="/forgot-password" className="text-xs font-medium text-[var(--brand-red)] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[var(--brand-red)]/50 focus:border-[var(--brand-red)] transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group w-full h-11 flex items-center justify-center gap-2 rounded-lg bg-foreground text-background font-semibold hover:bg-foreground/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  SIGN IN
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold text-foreground hover:text-[var(--brand-red)] transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
