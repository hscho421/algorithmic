import { Link } from 'react-router-dom';

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center font-body">
      <div className="w-full max-w-md rounded-[28px] border border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/70 shadow-xl shadow-zinc-200/60 dark:shadow-black/40 px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
            Account
          </div>
          <Link to="/" className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
            Back home
          </Link>
        </div>
        <h1 className="text-2xl font-display text-zinc-900 dark:text-white mt-4">{title}</h1>
        {subtitle && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">{subtitle}</p>
        )}
        <div className="mt-6 space-y-4">{children}</div>
        {footer && <div className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">{footer}</div>}
      </div>
    </div>
  );
}
