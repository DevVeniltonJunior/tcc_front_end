'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';
import Loading from '@/components/Loading';
import Button from '@/components/Button';
import Tabs from '@/components/Tabs';
import PlanningModal from '@/components/PlanningModal';
import GeneratePlanningModal from '@/components/GeneratePlanningModal';
import { planningService } from '@/lib/services';
import { Planning, CreatePlanningRequest, UpdatePlanningRequest, GeneratePlanningRequest } from '@/types';

export default function PlanejamentoPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [plannings, setPlannings] = useState<Planning[]>([]);
  const [loadingPlannings, setLoadingPlannings] = useState(true);
  const [isPlanningModalOpen, setIsPlanningModalOpen] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [editingPlanning, setEditingPlanning] = useState<Planning | undefined>(undefined);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const fetchPlannings = useCallback(async () => {
    try {
      setLoadingPlannings(true);
      if (user?.id) {
        const dataFetched = await planningService.getPlannings({ userId: user.id, deletedAt: null });
        const data = dataFetched.filter(planning => planning.userId === user.id && !planning.deletedAt);

        setPlannings(data);
      }
    } catch (error) {
      console.error('Erro ao buscar planejamentos:', error);
    } finally {
      setLoadingPlannings(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchPlannings();
    }
  }, [isAuthenticated, user, fetchPlannings]);

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setEditingPlanning(undefined);
    setIsPlanningModalOpen(true);
  };

  const handleOpenEditModal = (planning: Planning) => {
    setModalMode('edit');
    setEditingPlanning(planning);
    setIsPlanningModalOpen(true);
  };

  const handleClosePlanningModal = () => {
    setIsPlanningModalOpen(false);
    setEditingPlanning(undefined);
  };

  const handleOpenGenerateModal = () => {
    setIsGenerateModalOpen(true);
  };

  const handleCloseGenerateModal = () => {
    setIsGenerateModalOpen(false);
  };

  const handleSavePlanning = async (data: CreatePlanningRequest | UpdatePlanningRequest) => {
    if (modalMode === 'create') {
      await planningService.createPlanning(data as CreatePlanningRequest);
    } else {
      await planningService.updatePlanning(data as UpdatePlanningRequest);
    }
    await fetchPlannings();
  };

  const handleGeneratePlanning = async (data: GeneratePlanningRequest) => {
    await planningService.generatePlanning(data);
    await fetchPlannings();
  };

  const handleDeletePlanning = async (planningId: string) => {
    if (!confirm('Tem certeza que deseja excluir este planejamento?')) {
      return;
    }
    try {
      await planningService.deletePlanning(planningId);
      await fetchPlannings();
    } catch (error) {
      console.error('Erro ao excluir planejamento:', error);
      alert('Erro ao excluir planejamento. Tente novamente.');
    }
  };

  if (loading || loadingPlannings) {
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
            <button
              onClick={() => router.push('/settings')}
              className="p-2 rounded-lg transition-all hover:bg-opacity-80"
              style={{ backgroundColor: 'transparent' }}
              title="Configurações"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            Meus Planejamentos
          </h1>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleOpenGenerateModal}>
              Gerar com IA
            </Button>
            <Button onClick={handleOpenCreateModal}>
              Novo Planejamento
            </Button>
          </div>
        </div>

        {/* Plannings List */}
        {plannings.length === 0 ? (
          <div className="rounded-lg shadow p-8 text-center" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <p className="text-lg mb-4" style={{ color: 'var(--color-text-secondary)' }}>
              Você ainda não tem planejamentos cadastrados.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="secondary" onClick={handleOpenGenerateModal}>
                Gerar com IA
              </Button>
              <Button onClick={handleOpenCreateModal}>
                Criar Primeiro Planejamento
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {plannings.map((planning) => (
              <div 
                key={planning.id}
                className="rounded-lg shadow p-6"
                style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                      {planning.name}
                    </h3>
                    {planning.description && (
                      <p className="text-sm mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                        {planning.description}
                      </p>
                    )}
                    <div className="flex gap-4 text-sm mb-3">
                      <span style={{ color: 'var(--color-text-secondary)' }}>
                        Meta: <strong style={{ color: 'var(--color-primary)' }}>{planning.goal}</strong>
                      </span>
                      <span style={{ color: 'var(--color-text-secondary)' }}>
                        Valor: <strong style={{ color: 'var(--color-success)' }}>R$ {planning.goalValue.toFixed(2)}</strong>
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" className="px-4 py-2" onClick={() => handleOpenEditModal(planning)}>
                      Editar
                    </Button>
                    <Button 
                      variant="secondary" 
                      className="px-4 py-2"
                      onClick={() => handleDeletePlanning(planning.id)}
                      style={{ 
                        backgroundColor: 'var(--color-error)',
                        color: 'white'
                      }}
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
                
                {/* Planning Details */}
                <div className="rounded p-4" style={{ backgroundColor: 'var(--color-bg)' }}>
                  <h4 className="font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    Plano de Ação
                  </h4>
                  <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--color-text-secondary)' }}>
                    {planning.plan}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Card */}
        {plannings.length > 0 && (
          <div className="mt-8 rounded-lg shadow p-6" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Resumo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Total de Planejamentos</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                  {plannings.length}
                </p>
              </div>
              <div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Valor Total das Metas</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-success)' }}>
                  R$ {plannings.reduce((acc, planning) => acc + planning.goalValue, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Planning Modal */}
      <PlanningModal
        isOpen={isPlanningModalOpen}
        onClose={handleClosePlanningModal}
        onSave={handleSavePlanning}
        planning={editingPlanning}
        mode={modalMode}
      />

      {/* Generate Planning Modal */}
      <GeneratePlanningModal
        isOpen={isGenerateModalOpen}
        onClose={handleCloseGenerateModal}
        onGenerate={handleGeneratePlanning}
      />
    </div>
  );
}

