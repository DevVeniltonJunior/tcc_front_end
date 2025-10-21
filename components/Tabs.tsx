'use client';

import { useRouter, usePathname } from 'next/navigation';

interface Tab {
  id: string;
  label: string;
  path: string;
}

const tabs: Tab[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
  { id: 'contas', label: 'Contas', path: '/contas' },
  { id: 'planejamento', label: 'Planejamento', path: '/planejamento' },
];

export default function Tabs() {
  const router = useRouter();
  const pathname = usePathname();

  const handleTabClick = (path: string) => {
    router.push(path);
  };

  return (
    <div className="border-b overflow-x-auto" style={{ borderColor: 'var(--color-border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-4 sm:space-x-6 md:space-x-8 min-w-max sm:min-w-0" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = pathname === tab.path;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.path)}
                className={`
                  py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap
                  ${isActive
                    ? 'border-blue-500'
                    : 'border-transparent hover:border-gray-300'
                  }
                `}
                style={{
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  borderBottomColor: isActive ? 'var(--color-primary)' : 'transparent',
                }}
                aria-current={isActive ? 'page' : undefined}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

