export default function Button({
  children,
  variant = 'default',
  size = 'md',
  disabled = false,
  onClick,
  className = '',
  ...props
}) {
  const baseStyles = 'font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    default: 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white',
    primary: 'bg-blue-600 hover:bg-blue-500 text-white',
    success: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    warning: 'bg-amber-600 hover:bg-amber-500 text-white',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
