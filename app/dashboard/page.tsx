'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';
import Loading from '@/components/Loading';
import Button from '@/components/Button';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Header */}
      <header className="shadow" style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image 
              src="/finappai_logo.svg" 
              alt="FinAppAI Logo" 
              width={150} 
              height={50}
            />
          </div>
          <div className="flex items-center gap-4">
            <span style={{ color: 'var(--color-text-primary)' }}>Olá, {user.name}!</span>
            <Button variant="secondary" onClick={logout}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1 */}
          <div className="rounded-lg shadow p-6" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-secondary)' }}>Contas</h2>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>0</p>
            <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>Total de despesas cadastradas</p>
          </div>

          {/* Card 2 */}
          <div className="rounded-lg shadow p-6" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-secondary)' }}>Planejamentos</h2>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-success)' }}>0</p>
            <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>Objetivos financeiros ativos</p>
          </div>

          {/* Card 3 */}
          <div className="rounded-lg shadow p-6" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-secondary)' }}>Salário</h2>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {user.salary ? `R$ ${user.salary.toFixed(2)}` : 'Não informado'}
            </p>
            <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>Renda mensal</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg shadow p-6" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="w-full">Nova Conta</Button>
            <Button variant="secondary" className="w-full">Novo Planejamento</Button>
            <Button variant="secondary" className="w-full">Gerar com IA</Button>
            <Button variant="secondary" className="w-full">Ver Relatórios</Button>
          </div>
        </div>
      </main>
    </div>
  );
}

