export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderTopColor: 'var(--color-primary)', borderBottomColor: 'var(--color-primary)' }}></div>
    </div>
  );
}

