'use client';

import { useState, useEffect } from 'react';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';
import { Bill, CreateBillRequest, UpdateBillRequest } from '@/types';

interface BillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateBillRequest | UpdateBillRequest) => Promise<void>;
  bill?: Bill;
  mode: 'create' | 'edit';
}

export default function BillModal({ isOpen, onClose, onSave, bill, mode }: BillModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    description: '',
    installmentsNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (bill && mode === 'edit') {
      setFormData({
        name: bill.name,
        value: bill.value.toString(),
        description: bill.description || '',
        installmentsNumber: bill.installmentsNumber?.toString() || '',
      });
    } else {
      setFormData({
        name: '',
        value: '',
        description: '',
        installmentsNumber: '',
      });
    }
    setErrors({});
  }, [bill, mode, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.value || parseFloat(formData.value) <= 0) {
      newErrors.value = 'Valor deve ser maior que zero';
    }

    if (formData.installmentsNumber && parseInt(formData.installmentsNumber) <= 0) {
      newErrors.installmentsNumber = 'Número de parcelas deve ser maior que zero';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      const data: CreateBillRequest | UpdateBillRequest = {
        ...(mode === 'edit' && bill ? { id: bill.id } : {}),
        name: formData.name,
        value: parseFloat(formData.value),
        description: formData.description || undefined,
        installmentsNumber: formData.installmentsNumber ? parseInt(formData.installmentsNumber) : undefined,
      };

      await onSave(data);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar conta:', error);
      alert('Erro ao salvar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Nova Conta' : 'Editar Conta'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="Nome da Conta"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Internet, Luz, Água"
            error={errors.name}
            required
          />
        </div>

        <div>
          <Input
            label="Valor"
            type="number"
            step="0.01"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            placeholder="0.00"
            error={errors.value}
            required
          />
        </div>

        <div>
          <Input
            label="Descrição (opcional)"
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detalhes sobre a conta"
            error={errors.description}
          />
        </div>

        <div>
          <Input
            label="Número de Parcelas (opcional)"
            type="number"
            value={formData.installmentsNumber}
            onChange={(e) => setFormData({ ...formData, installmentsNumber: e.target.value })}
            placeholder="0"
            error={errors.installmentsNumber}
          />
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Deixe em branco para contas sem parcelamento
          </p>
        </div>
      </form>
    </Modal>
  );
}

