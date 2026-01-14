export default function ResultBanner({ success, title, message, details }) {
  if (title === undefined && message === undefined) return null;

  return (
    <div
      className={`
        rounded-xl p-4 border-2 text-center
        ${success
          ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
          : 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-300'
        }
      `}
    >
      <div className="text-lg font-semibold mb-1">{title}</div>
      {message && <div className="text-sm opacity-80">{message}</div>}
      {details && <div className="text-xs mt-2 opacity-60">{details}</div>}
    </div>
  );
}
