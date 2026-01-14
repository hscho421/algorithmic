export default function Card({ title, children, className = '' }) {
  return (
    <div className={`bg-zinc-900 rounded-xl border border-zinc-800 ${className}`}>
      {title && (
        <div className="px-5 py-4 border-b border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
            {title}
          </h2>
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}
