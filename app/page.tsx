import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--color-bg)' }}>
      <div className="text-center max-w-2xl w-full">
        <div className="flex justify-center mb-3">
          <Image 
            src="/finappai_logo.svg" 
            alt="FinAppAI Logo" 
            width={360} 
            height={120}
            priority
            className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] h-auto"
          />
        </div>
        <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 px-4" style={{ color: 'var(--color-text-secondary)' }}>
          Gerencie suas finanças pessoais de forma inteligente!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
          <a
            href="/login"
            className="px-6 py-3 rounded-lg transition-colors text-center"
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
            className="px-6 py-3 rounded-lg transition-colors text-center"
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

