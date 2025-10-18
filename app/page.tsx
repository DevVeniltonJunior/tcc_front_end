import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
      <div className="text-center">
        <div className="flex justify-center mb-3">
          <Image 
            src="/finappai_logo.svg" 
            alt="FinAppAI Logo" 
            width={360} 
            height={120}
            priority
          />
        </div>
        <p className="text-xl mb-8" style={{ color: 'var(--color-text-secondary)' }}>
          Gerencie suas finanças pessoais de forma inteligente!
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/login"
            className="px-6 py-3 rounded-lg transition-colors"
            style={{ 
              backgroundColor: 'var(--color-primary)', 
              color: 'var(--color-bg)',
              fontWeight: '600'
            }}
          >
            Entrar
          </a>
          <a
            href="/register"
            className="px-6 py-3 rounded-lg transition-colors"
            style={{ 
              backgroundColor: 'var(--color-surface)', 
              color: 'var(--color-primary)',
              border: '2px solid var(--color-primary)'
            }}
          >
            Cadastrar
          </a>
        </div>
      </div>
    </div>
  );
}

