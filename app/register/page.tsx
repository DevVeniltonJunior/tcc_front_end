'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { authService } from '@/lib/services';
import Button from '@/components/Button';
import Input from '@/components/Input';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    birthdate: '',
    password: '',
    confirmPassword: '',
    salary: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, salary, ...registerData } = formData;
      const response = await authService.register({
        ...registerData,
        salary: salary ? parseFloat(salary) : undefined,
      });
      authService.saveAuth(response);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar conta. Tente novamente.');
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
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ background: 'var(--color-bg)' }}>
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
          Crie sua conta
        </h1>
        <p className="mb-6 text-center" style={{ color: 'var(--color-text-secondary)' }}>
          Comece a gerenciar suas finanças com IA
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
            label="Nome completo"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="João Silva"
            required
          />

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
            label="Data de nascimento"
            type="date"
            name="birthdate"
            value={formData.birthdate}
            onChange={handleChange}
            required
          />

          <Input
            label="Salário mensal (opcional)"
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="5000.00"
            step="0.01"
            min="0"
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

          <Input
            label="Confirmar senha"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          <Button type="submit" loading={loading} className="w-full">
            Cadastrar
          </Button>
        </form>

        <p className="mt-6 text-center" style={{ color: 'var(--color-text-secondary)' }}>
          Já tem uma conta?{' '}
          <Link href="/login" className="font-medium" style={{ color: 'var(--color-primary)' }}>
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}

