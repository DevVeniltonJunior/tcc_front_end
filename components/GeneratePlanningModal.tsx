'use client';

import { useState, useEffect } from 'react';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';
import { GeneratePlanningRequest } from '@/types';

interface GeneratePlanningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: GeneratePlanningRequest) => Promise<void>;
}

export default function GeneratePlanningModal({ isOpen, onClose, onGenerate }: GeneratePlanningModalProps) {
  const [formData, setFormData] = useState({
    goal: '',
    goalValue: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        goal: '',
        goalValue: '',
        description: '',
      });
      setErrors({});
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.goal.trim()) {
      newErrors.goal = 'Meta é obrigatória';
    }

    if (!formData.goalValue || parseFloat(formData.goalValue) <= 0) {
      newErrors.goalValue = 'Valor da meta deve ser maior que zero';
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
      const data: GeneratePlanningRequest = {
        goal: formData.goal,
        goalValue: parseFloat(formData.goalValue),
        description: formData.description || undefined,
      };

      await onGenerate(data);
      onClose();
    } catch (error) {
      console.error('Erro ao gerar planejamento:', error);
      alert('Erro ao gerar planejamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Gerar Planejamento com IA"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Gerando...' : 'Gerar com IA'}
          </Button>
        </>
      }
    >
      <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg)' }}>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          A IA irá analisar sua meta e criar um planejamento financeiro personalizado para você alcançá-la.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="Qual é sua meta?"
            type="text"
            value={formData.goal}
            onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
            placeholder="Ex: Comprar um carro zero, Viajar para o exterior, Aposentadoria"
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
          <Input
            label="Informações Adicionais (opcional)"
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Prazo desejado, preferências, etc."
            error={errors.description}
          />
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Quanto mais detalhes, melhor será o planejamento gerado pela IA.
          </p>
        </div>
      </form>
    </Modal>
  );
}

