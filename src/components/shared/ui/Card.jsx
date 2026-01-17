export default function Card({
  title,
  children,
  className = '',
  noPadding = false,
  compact = false,
  transparent = false
}) {
  const baseClasses = transparent
    ? 'bg-transparent'
    : 'bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800';

  const headerPadding = compact ? 'px-4 py-2' : 'px-5 py-4';
  const contentPadding = noPadding ? '' : (compact ? 'p-4' : 'p-5');

  return (
    <div className={`${baseClasses} ${className}`}>
      {title && (
        <div className={`${headerPadding} border-b border-zinc-200 dark:border-zinc-800`}>
          <h2 className={`${compact ? 'text-xs' : 'text-sm'} font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider`}>
            {title}
          </h2>
        </div>
      )}
      <div className={contentPadding}>{children}</div>
    </div>
  );
}