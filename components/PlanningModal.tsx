'use client';

import { useState, useEffect } from 'react';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';
import { Planning, CreatePlanningRequest, UpdatePlanningRequest } from '@/types';

interface PlanningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreatePlanningRequest | UpdatePlanningRequest) => Promise<void>;
  planning?: Planning;
  mode: 'create' | 'edit';
}

export default function PlanningModal({ isOpen, onClose, onSave, planning, mode }: PlanningModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    goal: '',
    goalValue: '',
    plan: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (planning && mode === 'edit') {
      setFormData({
        name: planning.name,
        description: planning.description || '',
        goal: planning.goal,
        goalValue: planning.goalValue.toString(),
        plan: planning.plan,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        goal: '',
        goalValue: '',
        plan: '',
      });
    }
    setErrors({});
  }, [planning, mode, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.goal.trim()) {
      newErrors.goal = 'Meta é obrigatória';
    }

    if (!formData.goalValue || parseFloat(formData.goalValue) <= 0) {
      newErrors.goalValue = 'Valor da meta deve ser maior que zero';
    }

    if (!formData.plan.trim()) {
      newErrors.plan = 'Plano de ação é obrigatório';
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
      const data: CreatePlanningRequest | UpdatePlanningRequest = {
        ...(mode === 'edit' && planning ? { id: planning.id } : {}),
        name: formData.name,
        description: formData.description || undefined,
        goal: formData.goal,
        goalValue: parseFloat(formData.goalValue),
        plan: formData.plan,
      };

      await onSave(data);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar planejamento:', error);
      alert('Erro ao salvar planejamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Novo Planejamento' : 'Editar Planejamento'}
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
            label="Nome do Planejamento"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Comprar Carro, Viagem, Aposentadoria"
            error={errors.name}
            required
          />
        </div>

        <div>
          <Input
            label="Descrição (opcional)"
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detalhes sobre o planejamento"
            error={errors.description}
          />
        </div>

        <div>
          <Input
            label="Meta"
            type="text"
            value={formData.goal}
            onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
            placeholder="Ex: Comprar um carro zero"
            error={errors.goal}
            required
          />
        </div>

        <div>
          <Input
            label="Valor da Meta"
            type="number"
            step="0.01"
            value={formData.goalValue}
            onChange={(e) => setFormData({ ...formData, goalValue: e.target.value })}
            placeholder="0.00"
            error={errors.goalValue}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Plano de Ação <span style={{ color: 'var(--color-error)' }}>*</span>
          </label>
          <textarea
            value={formData.plan}
            onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
            placeholder="Descreva seu plano de ação para alcançar esta meta..."
            rows={6}
            className="w-full px-4 py-2 rounded-lg border transition-colors"
            style={{
              backgroundColor: 'var(--color-bg)',
              borderColor: errors.plan ? 'var(--color-error)' : 'var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
            required
          />
          {errors.plan && (
            <p className="text-sm mt-1" style={{ color: 'var(--color-error)' }}>
              {errors.plan}
            </p>
          )}
        </div>
      </form>
    </Modal>
  );
}

