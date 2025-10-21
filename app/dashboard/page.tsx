'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';
import Loading from '@/components/Loading';
import Button from '@/components/Button';
import Tabs from '@/components/Tabs';
import BillModal from '@/components/BillModal';
import PlanningModal from '@/components/PlanningModal';
import GeneratePlanningModal from '@/components/GeneratePlanningModal';
import { userService, billService, planningService } from '@/lib/services';
import { UserSummary, CreateBillRequest, UpdateBillRequest, CreatePlanningRequest, UpdatePlanningRequest, GeneratePlanningRequest } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [summary, setSummary] = useState<UserSummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [isPlanningModalOpen, setIsPlanningModalOpen] = useState(false);
  const [isGeneratePlanningModalOpen, setIsGeneratePlanningModalOpen] = useState(false);

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

  const handleCreateBill = async (data: CreateBillRequest | UpdateBillRequest) => {
    try {
      await billService.createBill(data as CreateBillRequest);
      router.push('/contas');
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      throw error;
    }
  };

  const handleCreatePlanning = async (data: CreatePlanningRequest | UpdatePlanningRequest) => {
    try {
      await planningService.createPlanning(data as CreatePlanningRequest);
      router.push('/planejamento');
    } catch (error) {
      console.error('Erro ao criar planejamento:', error);
      throw error;
    }
  };

  const handleGeneratePlanning = async (data: GeneratePlanningRequest) => {
    try {
      await planningService.generatePlanning(data);
      router.push('/planejamento');
    } catch (error) {
      console.error('Erro ao gerar planejamento:', error);
      throw error;
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-3">
              <Image 
                src="/finappai_logo.svg" 
                alt="FinAppAI Logo" 
                width={150} 
                height={50}
                className="w-[100px] sm:w-[120px] md:w-[150px] h-auto"
              />
            </div>
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              <span className="hidden sm:inline text-sm md:text-base" style={{ color: 'var(--color-text-primary)' }}>Olá, {user.name}!</span>
              <button
                onClick={() => router.push('/settings')}
                className="p-1.5 sm:p-2 rounded-lg transition-all hover:bg-opacity-80"
                style={{ backgroundColor: 'transparent' }}
                title="Configurações"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 sm:h-6 sm:w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  style={{ color: 'var(--color-primary)' }}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
                  />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                  />
                </svg>
              </button>
              <Button variant="secondary" onClick={logout} className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2">
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <Tabs />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Summary Cards - Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          {/* Card 1 - Contas Ativas */}
          <div className="rounded-lg shadow-md p-4 sm:p-5 md:p-6 transition-all hover:shadow-lg" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 uppercase tracking-wide" style={{ color: 'var(--color-text-secondary)' }}>Contas Ativas</h2>
            <p className="text-3xl sm:text-4xl font-bold mb-1 sm:mb-2" style={{ color: 'var(--color-primary)' }}>
              {summary?.billsActiveCount || 0}
            </p>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Total de contas cadastradas</p>
          </div>

          {/* Card 2 - Planejamentos Ativos */}
          <div className="rounded-lg shadow-md p-4 sm:p-5 md:p-6 transition-all hover:shadow-lg" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 uppercase tracking-wide" style={{ color: 'var(--color-text-secondary)' }}>Planejamentos Ativos</h2>
            <p className="text-3xl sm:text-4xl font-bold mb-1 sm:mb-2" style={{ color: 'var(--color-primary)' }}>
              {summary?.planningsCount || 0}
            </p>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Total de planejamentos cadastrados</p>
          </div>

          {/* Card 3 - Total Mensal */}
          <div className="rounded-lg shadow-md p-4 sm:p-5 md:p-6 transition-all hover:shadow-lg" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 uppercase tracking-wide" style={{ color: 'var(--color-text-secondary)' }}>Total Mensal</h2>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 break-words" style={{ color: 'var(--color-primary)' }}>
              R$ {summary?.totalBillsValueMonthly?.toFixed(2) || '0.00'}
            </p>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Despesas deste mês</p>
          </div>

          {/* Card 4 - Salário */}
          <div className="rounded-lg shadow-md p-4 sm:p-5 md:p-6 transition-all hover:shadow-lg" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 uppercase tracking-wide" style={{ color: 'var(--color-text-secondary)' }}>Salário</h2>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 break-words" style={{ color: 'var(--color-success)' }}>
              {summary?.salary ? `R$ ${summary?.salary.toFixed(2)}` : 'Não informado'}
            </p>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Renda mensal</p>
          </div>
        </div>

        {/* Projection Cards - Row 2 */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 px-1" style={{ color: 'var(--color-text-primary)' }}>Projeção de Gastos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {/* Card 5 - Próximo Mês */}
            <div className="rounded-lg shadow-md p-4 sm:p-5 md:p-6 transition-all hover:shadow-lg" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              <h2 className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 uppercase tracking-wide" style={{ color: 'var(--color-text-secondary)' }}>Próximo Mês</h2>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 break-words" style={{ color: 'var(--color-warning)' }}>
                R$ {summary?.partialValueNextMonth?.toFixed(2) || '0.00'}
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Projeção de gastos</p>
            </div>

            {/* Card 6 - Daqui 2 Meses */}
            <div className="rounded-lg shadow-md p-4 sm:p-5 md:p-6 transition-all hover:shadow-lg" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              <h2 className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 uppercase tracking-wide" style={{ color: 'var(--color-text-secondary)' }}>Daqui 2 Meses</h2>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 break-words" style={{ color: 'var(--color-warning)' }}>
                R$ {summary?.partialValue2MonthsLater?.toFixed(2) || '0.00'}
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Projeção de gastos</p>
            </div>

            {/* Card 7 - Daqui 3 Meses */}
            <div className="rounded-lg shadow-md p-4 sm:p-5 md:p-6 transition-all hover:shadow-lg" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              <h2 className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 uppercase tracking-wide" style={{ color: 'var(--color-text-secondary)' }}>Daqui 3 Meses</h2>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 break-words" style={{ color: 'var(--color-warning)' }}>
                R$ {summary?.partialValue3MonthsLater?.toFixed(2) || '0.00'}
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Projeção de gastos</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg shadow-md p-4 sm:p-5 md:p-6" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6" style={{ color: 'var(--color-text-primary)' }}>Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            <Button className="w-full py-2.5 sm:py-3 text-sm sm:text-base" onClick={() => setIsBillModalOpen(true)}>Nova Conta</Button>
            <Button variant="secondary" className="w-full py-2.5 sm:py-3 text-sm sm:text-base" onClick={() => setIsPlanningModalOpen(true)}>Novo Planejamento</Button>
            <Button variant="secondary" className="w-full py-2.5 sm:py-3 text-sm sm:text-base" onClick={() => setIsGeneratePlanningModalOpen(true)}>Gerar com IA</Button>
          </div>
        </div>
      </main>

      {/* Modals */}
      <BillModal
        isOpen={isBillModalOpen}
        onClose={() => setIsBillModalOpen(false)}
        onSave={handleCreateBill}
        mode="create"
      />

      <PlanningModal
        isOpen={isPlanningModalOpen}
        onClose={() => setIsPlanningModalOpen(false)}
        onSave={handleCreatePlanning}
        mode="create"
      />

      <GeneratePlanningModal
        isOpen={isGeneratePlanningModalOpen}
        onClose={() => setIsGeneratePlanningModalOpen(false)}
        onGenerate={handleGeneratePlanning}
      />
    </div>
  );
}

