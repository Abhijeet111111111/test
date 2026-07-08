// components/providers/AuthProvider.tsx
'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setUser, logout, setLoading } from '@/store/slices/authSlice';
import { getCurrentUser } from '@/lib/auth';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(setLoading(true));
      getCurrentUser()
        .then((u) => dispatch(setUser(u)))
        .catch(() => dispatch(logout())); // token expired/invalid
    }
  }, [token, user, dispatch]);

  return <>{children}</>;
}