'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';
import Loading from '@/components/Loading';
import Button from '@/components/Button';
import Tabs from '@/components/Tabs';
import BillModal from '@/components/BillModal';
import { billService } from '@/lib/services';
import { Bill, CreateBillRequest, UpdateBillRequest } from '@/types';

export default function ContasPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [bills, setBills] = useState<Bill[]>([]);
  const [loadingBills, setLoadingBills] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | undefined>(undefined);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const fetchBills = useCallback(async () => {
    try {
      setLoadingBills(true);
      if (user?.id) {
        const dataFetched = await billService.getBills({ userId: user.id, deletedAt: null });
        
        const data = dataFetched.filter(bill => bill.userId === user.id && !bill.deletedAt);

        setBills(data);
      }
    } catch (error) {
      console.error('Erro ao buscar contas:', error);
    } finally {
      setLoadingBills(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchBills();
    }
  }, [isAuthenticated, user, fetchBills]);

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setEditingBill(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (bill: Bill) => {
    setModalMode('edit');
    setEditingBill(bill);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBill(undefined);
  };

  const handleSaveBill = async (data: CreateBillRequest | UpdateBillRequest) => {
    if (modalMode === 'create') {
      await billService.createBill(data as CreateBillRequest);
    } else {
      await billService.updateBill(data as UpdateBillRequest);
    }
    await fetchBills();
  };

  const handleDeleteBill = async (billId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta conta?')) {
      return;
    }
    try {
      await billService.deleteBill(billId);
      await fetchBills();
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      alert('Erro ao excluir conta. Tente novamente.');
    }
  };

  if (loading || loadingBills) {
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
            Minhas Contas
          </h1>
          <Button onClick={handleOpenCreateModal}>
            Nova Conta
          </Button>
        </div>

        {/* Bills List */}
        {bills.length === 0 ? (
          <div className="rounded-lg shadow p-8 text-center" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <p className="text-lg mb-4" style={{ color: 'var(--color-text-secondary)' }}>
              Você ainda não tem contas cadastradas.
            </p>
            <Button onClick={handleOpenCreateModal}>
              Cadastrar Primeira Conta
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {bills.map((bill) => (
              <div 
                key={bill.id}
                className="rounded-lg shadow p-6 flex justify-between items-center"
                style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
              >
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    {bill.name}
                  </h3>
                  {bill.description && (
                    <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                      {bill.description}
                    </p>
                  )}
                  <div className="flex gap-4 text-sm">
                    <span style={{ color: 'var(--color-text-secondary)' }}>
                      Valor: <strong style={{ color: 'var(--color-primary)' }}>R$ {bill.value.toFixed(2)}</strong>
                    </span>
                    {bill.installmentsNumber && (
                      <span style={{ color: 'var(--color-text-secondary)' }}>
                        Parcelas: <strong>{bill.installmentsNumber}x</strong>
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" className="px-4 py-2" onClick={() => handleOpenEditModal(bill)}>
                    Editar
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="px-4 py-2"
                    onClick={() => handleDeleteBill(bill.id)}
                    style={{ 
                      backgroundColor: 'var(--color-error)',
                      color: 'white'
                    }}
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Card */}
        {bills.length > 0 && (
          <div className="mt-8 rounded-lg shadow p-6" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Resumo</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Total de Contas</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                  {bills.length}
                </p>
              </div>
              <div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Valor Total</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                  R$ {bills.reduce((acc, bill) => acc + bill.value, 0).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Contas Parceladas</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                  {bills.filter(bill => bill.installmentsNumber).length}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bill Modal */}
      <BillModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveBill}
        bill={editingBill}
        mode={modalMode}
      />
    </div>
  );
}

