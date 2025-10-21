interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
}

export default function Button({ 
  children, 
  variant = 'primary', 
  loading = false,
  disabled,
  className = '',
  ...props 
}: ButtonProps) {
  const baseClasses = 'px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base';
  
  const variantStyles = {
    primary: {
      backgroundColor: 'var(--color-primary)',
      color: 'var(--color-bg)',
    },
    secondary: {
      backgroundColor: 'var(--color-surface)',
      color: 'var(--color-primary)',
      border: '2px solid var(--color-primary)',
    },
    danger: {
      backgroundColor: 'var(--color-error)',
      color: 'var(--color-text-primary)',
    },
  };

  return (
    <button 
      className={`${baseClasses} ${className}`}
      style={variantStyles[variant]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-t-2 border-b-2" style={{ borderTopColor: variant === 'primary' ? 'var(--color-bg)' : 'var(--color-primary)', borderBottomColor: variant === 'primary' ? 'var(--color-bg)' : 'var(--color-primary)' }}></div>
        </div>
      ) : (
        children
      )}
    </button>
  );
}

