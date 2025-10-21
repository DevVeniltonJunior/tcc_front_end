'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';
import Loading from '@/components/Loading';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { userService } from '@/lib/services';
import { UpdateUserRequest } from '@/types';

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated, logout, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    birthdate: '',
    salary: '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        birthdate: user.birthdate ? user.birthdate.split('T')[0] : '',
        salary: user.salary ? user.salary.toString() : '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSaving(true);

    try {
      if (!user?.id) {
        throw new Error('Usuário não encontrado');
      }

      const updateData: UpdateUserRequest = {
        id: user.id,
        name: formData.name,
        email: formData.email,
        birthdate: formData.birthdate,
        salary: formData.salary ? parseFloat(formData.salary) : undefined,
      };

      await userService.updateUser(updateData);
      
      // Atualiza os dados do usuário no contexto
      if (refreshUser) {
        await refreshUser();
      }

      setMessage({ type: 'success', text: 'Informações atualizadas com sucesso!' });
    } catch (error: any) {
      console.error('Erro ao atualizar usuário:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Erro ao atualizar informações. Tente novamente.' 
      });
    } finally {
      setSaving(false);
    }
  };

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
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="hidden sm:inline text-sm md:text-base" style={{ color: 'var(--color-text-primary)' }}>Olá, {user.name}!</span>
              <Button variant="secondary" onClick={logout} className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2">
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="mb-4 sm:mb-6">
          <Button 
            variant="secondary" 
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2"
          >
            <span>←</span>
            <span>Voltar ao Dashboard</span>
          </Button>
        </div>

        <div className="rounded-lg shadow-md p-4 sm:p-6 md:p-8" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" 
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
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Configurações
            </h1>
          </div>

          <p className="mb-6 sm:mb-8 text-sm sm:text-base" style={{ color: 'var(--color-text-secondary)' }}>
            Atualize suas informações pessoais
          </p>

          {message && (
            <div 
              className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg text-sm sm:text-base"
              style={{ 
                backgroundColor: message.type === 'success' ? 'var(--color-success-light, #d4edda)' : 'var(--color-error-light, #f8d7da)',
                color: message.type === 'success' ? 'var(--color-success-dark, #155724)' : 'var(--color-error-dark, #721c24)',
                border: `1px solid ${message.type === 'success' ? 'var(--color-success, #28a745)' : 'var(--color-error, #dc3545)'}`
              }}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <Input
              label="Nome"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              label="Data de Nascimento"
              name="birthdate"
              type="date"
              value={formData.birthdate}
              onChange={handleChange}
              required
            />

            <Input
              label="Salário (opcional)"
              name="salary"
              type="number"
              step="0.01"
              value={formData.salary}
              onChange={handleChange}
              placeholder="0.00"
            />

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
              <Button 
                type="submit" 
                className="flex-1 text-sm sm:text-base"
                disabled={saving}
              >
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => router.push('/dashboard')}
                disabled={saving}
                className="text-sm sm:text-base"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

