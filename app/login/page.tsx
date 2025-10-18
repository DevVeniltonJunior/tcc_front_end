'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { authService } from '@/lib/services';
import Button from '@/components/Button';
import Input from '@/components/Input';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(formData);
      authService.saveAuth(response);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-md w-full rounded-xl shadow-lg p-8" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="flex justify-center mb-2">
          <Image 
            src="/finappai_logo.svg" 
            alt="FinAppAI Logo" 
            width={280} 
            height={93}
            priority
          />
        </div>
        <h1 className="text-3xl font-bold mb-2 text-center" style={{ color: 'var(--color-text-primary)' }}>
          Bem-vindo de volta!
        </h1>
        <p className="mb-6 text-center" style={{ color: 'var(--color-text-secondary)' }}>
          Entre com suas credenciais
        </p>

        {error && (
          <div className="px-4 py-3 rounded-lg mb-4" style={{ 
            backgroundColor: 'rgba(255, 82, 82, 0.1)', 
            border: '1px solid var(--color-error)', 
            color: 'var(--color-error)' 
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="seu@email.com"
            required
          />

          <Input
            label="Senha"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          <div className="flex items-center justify-between text-sm">
            <Link href="/forgot-password" style={{ color: 'var(--color-primary)' }}>
              Esqueceu a senha?
            </Link>
          </div>

          <Button type="submit" loading={loading} className="w-full">
            Entrar
          </Button>
        </form>

        <p className="mt-6 text-center" style={{ color: 'var(--color-text-secondary)' }}>
          Não tem uma conta?{' '}
          <Link href="/register" className="font-medium" style={{ color: 'var(--color-primary)' }}>
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}

