export default function ResultBanner({ success, title, message, details }) {
  if (title === undefined && message === undefined) return null;

  return (
    <div
      className={`
        rounded-xl p-4 border-2 text-center
        ${success
          ? 'bg-emerald-950/50 border-emerald-700 text-emerald-300'
          : 'bg-rose-950/50 border-rose-700 text-rose-300'
        }
      `}
    >
      <div className="text-lg font-semibold mb-1">{title}</div>
      {message && <div className="text-sm opacity-80">{message}</div>}
      {details && <div className="text-xs mt-2 opacity-60">{details}</div>}
    </div>
  );
}
