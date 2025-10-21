'use client';

import { useState, useEffect } from 'react';
import { authService, userService } from '@/lib/services';
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

  const refreshUser = async () => {
    try {
      if (!user?.id) return;
      
      const updatedUser = await userService.getUser({ id: user.id });
      setUser(updatedUser);
      
      // Atualiza o usuário no localStorage também
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
    }
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    logout,
    refreshUser,
  };
}

