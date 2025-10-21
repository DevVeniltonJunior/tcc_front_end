interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs sm:text-sm font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent text-sm sm:text-base ${className}`}
        style={{
          backgroundColor: 'var(--color-bg)',
          color: 'var(--color-text-primary)',
          borderColor: error ? 'var(--color-error)' : 'var(--color-border)',
        }}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs sm:text-sm" style={{ color: 'var(--color-error)' }}>{error}</p>
      )}
    </div>
  );
}

