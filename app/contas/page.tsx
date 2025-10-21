'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';
import Loading from '@/components/Loading';
import Button from '@/components/Button';
import Tabs from '@/components/Tabs';
import BillModal from '@/components/BillModal';
import Pagination from '@/components/Pagination';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const fetchBills = useCallback(async () => {
    try {
      setLoadingBills(true);
      if (user?.id) {
        const response = await billService.getBills(
          { userId: user.id, deletedAt: null },
          currentPage,
          itemsPerPage,
          "createdAt",
          "desc"
        );
        
        setBills(response.data || []);
        setTotalItems(response.pagination.total || 0);
      }
    } catch (error) {
      console.error('Erro ao buscar contas:', error);
      setBills([]);
      setTotalItems(0);
    } finally {
      setLoadingBills(false);
    }
  }, [user?.id, currentPage, itemsPerPage]);

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
    // Voltar para a primeira página após criar/editar
    setCurrentPage(1);
    await fetchBills();
  };

  const handleDeleteBill = async (billId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta conta?')) {
      return;
    }
    try {
      await billService.deleteBill(billId);
      // Se estamos na última página e era o único item, voltar para a página anterior
      if (bills.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      await fetchBills();
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      alert('Erro ao excluir conta. Tente novamente.');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            Minhas Contas
          </h1>
          <Button onClick={handleOpenCreateModal} className="w-full sm:w-auto text-sm sm:text-base">
            Nova Conta
          </Button>
        </div>

        {/* Bills List */}
        {bills.length === 0 ? (
          <div className="rounded-lg shadow p-6 sm:p-8 text-center" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <p className="text-base sm:text-lg mb-4" style={{ color: 'var(--color-text-secondary)' }}>
              Você ainda não tem contas cadastradas.
            </p>
            <Button onClick={handleOpenCreateModal} className="text-sm sm:text-base">
              Cadastrar Primeira Conta
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {bills.map((bill) => (
                <div 
                  key={bill.id}
                  className="rounded-lg shadow p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                  style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                >
                  <div className="flex-1 w-full sm:w-auto">
                    <h3 className="text-lg sm:text-xl font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                      {bill.name}
                    </h3>
                    {bill.description && (
                      <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                        {bill.description}
                      </p>
                    )}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm">
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
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="secondary" className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm" onClick={() => handleOpenEditModal(bill)}>
                      Editar
                    </Button>
                    <Button 
                      variant="secondary" 
                      className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm"
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
            
            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </>
        )}

        {/* Summary Card */}
        {bills.length > 0 && (
          <div className="mt-6 sm:mt-8 rounded-lg shadow p-4 sm:p-6" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4" style={{ color: 'var(--color-text-primary)' }}>Resumo</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm" style={{ color: 'var(--color-text-secondary)' }}>Total de Contas</p>
                <p className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                  {bills.length}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm" style={{ color: 'var(--color-text-secondary)' }}>Valor Total</p>
                <p className="text-xl sm:text-2xl font-bold break-words" style={{ color: 'var(--color-primary)' }}>
                  R$ {bills.reduce((acc, bill) => acc + bill.value, 0).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm" style={{ color: 'var(--color-text-secondary)' }}>Contas Parceladas</p>
                <p className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
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

