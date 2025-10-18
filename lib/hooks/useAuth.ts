'use client';

import { useState, useEffect } from 'react';
import { authService } from '@/lib/services';
import { User } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = authService.getUser();
    setUser(storedUser);
    setLoading(false);
  }, []);

  const logout = () => {
    authService.logout();
    setUser(null);
    window.location.href = '/login';
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    logout,
  };
}

