'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';
import Loading from '@/components/Loading';
import Button from '@/components/Button';
import Tabs from '@/components/Tabs';
import { userService } from '@/lib/services';
import { UserSummary } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [summary, setSummary] = useState<UserSummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSummary();
    }
  }, [isAuthenticated]);

  const fetchSummary = async () => {
    try {
      setLoadingSummary(true);
      const data = await userService.getUserSummary();
      // A API retorna os dados dentro de uma propriedade 'summary'
      setSummary(data.summary || data);
    } catch (error) {
      console.error('Erro ao buscar resumo do usuário:', error);
    } finally {
      setLoadingSummary(false);
    }
  };

  if (loading || loadingSummary) {
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

      {/* Tabs */}
      <Tabs />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards - Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1 - Contas Ativas */}
          <div className="rounded-lg shadow p-6" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-secondary)' }}>Contas Ativas</h2>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>
              {summary?.billsActiveCount || 0}
            </p>
            <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>Total de contas cadastradas</p>
          </div>

          {/* Card 1 - Planejamentos Ativos */}
          <div className="rounded-lg shadow p-6" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-secondary)' }}>Planejamentos Ativos</h2>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>
              {summary?.planningsCount || 0}
            </p>
            <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>Total de planejamentos cadastrados</p>
          </div>

          {/* Card 3 - Total Mensal */}
          <div className="rounded-lg shadow p-6" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-secondary)' }}>Total Mensal</h2>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>
              R$ {summary?.totalBillsValueMonthly?.toFixed(2) || '0.00'}
            </p>
            <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>Despesas deste mês</p>
          </div>

          {/* Card 4 - Salário */}
          <div className="rounded-lg shadow p-6" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-secondary)' }}>Salário</h2>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-success)' }}>
              {summary?.salary ? `R$ ${summary?.salary.toFixed(2)}` : 'Não informado'}
            </p>
            <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>Renda mensal</p>
          </div>
        </div>

        {/* Projection Cards - Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 5 - Próximo Mês */}
          <div className="rounded-lg shadow p-6" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-secondary)' }}>Próximo Mês</h2>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-warning)' }}>
              R$ {summary?.partialValueNextMonth?.toFixed(2) || '0.00'}
            </p>
            <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>Projeção de gastos</p>
          </div>

          {/* Card 6 - Daqui 2 Meses */}
          <div className="rounded-lg shadow p-6" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-secondary)' }}>Daqui 2 Meses</h2>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-warning)' }}>
              R$ {summary?.partialValue2MonthsLater?.toFixed(2) || '0.00'}
            </p>
            <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>Projeção de gastos</p>
          </div>

          {/* Card 7 - Daqui 3 Meses */}
          <div className="rounded-lg shadow p-6" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-secondary)' }}>Daqui 3 Meses</h2>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-warning)' }}>
              R$ {summary?.partialValue3MonthsLater?.toFixed(2) || '0.00'}
            </p>
            <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>Projeção de gastos</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg shadow p-6" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button className="w-full">Nova Conta</Button>
            <Button variant="secondary" className="w-full">Novo Planejamento</Button>
            <Button variant="secondary" className="w-full">Gerar com IA</Button>
          </div>
        </div>
      </main>
    </div>
  );
}

